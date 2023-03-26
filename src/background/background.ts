import { HtmlCssInfo } from "../types/props"
import {
  HtmlCssInfoInterface,
  OverlayActivatorInterface,
  RespondTabIdInfoInterface,
} from "../types/types"
import {
  CONTENT_SCRIPT_RUNTIME_CONNECTION_PORT,
  DEVTOOL_RUNTIME_CONNECTION_PORT,
} from "../constants/constants"
import { MessageTypes } from "../types/enums"

const devtoolPorts = new Map<number, chrome.runtime.Port>()
const contentScriptPorts = new Map<number, chrome.runtime.Port>()

const removeDisconnectedPort = (
  port: chrome.runtime.Port,
  portMap: Map<number, chrome.runtime.Port>
) => {
  for (const [tabId, storedPort] of portMap.entries()) {
    if (storedPort === port) {
      portMap.delete(tabId)
      break
    }
  }
}

const devtoolPortMessageListner = (
  message: OverlayActivatorInterface | RespondTabIdInfoInterface,
  port: chrome.runtime.Port
) => {
  if (message.message_type === MessageTypes.RESPOND_TAB_ID_MESSAGE) {
    if (message.tabId) devtoolPorts.set(message.tabId, port)
  } else if (message.message_type === MessageTypes.OVERLAY_ACTIVATOR_MESSAGE) {
    const contentScriptPort = contentScriptPorts.get(message.tabId)
    if (contentScriptPort) contentScriptPort.postMessage(message)
  }
}

const contentScriptPortMessageListner = (
  message: HtmlCssInfoInterface,
  port: chrome.runtime.Port
) => {
  // send this to devtool port
  const devtoolPort = devtoolPorts.get(message.tabId)
  if (devtoolPort) devtoolPort.postMessage(message)
}

const handleDevtoolPort = (port: chrome.runtime.Port) => {
  port.onMessage.addListener(devtoolPortMessageListner)
  port.onDisconnect.addListener((port) => {
    port.disconnect()
    removeDisconnectedPort(port, devtoolPorts)
  })
}

const handleContentScriptPort = (port: chrome.runtime.Port) => {
  contentScriptPorts.set(port.sender.tab.id, port)
  port.postMessage({
    message_type: MessageTypes.RESPOND_TAB_ID_MESSAGE,
    tabId: port.sender.tab.id,
  } as RespondTabIdInfoInterface)
  port.onMessage.addListener(contentScriptPortMessageListner)
  port.onDisconnect.addListener((port) => {
    port.disconnect()
    removeDisconnectedPort(port, contentScriptPorts)
  })
}

const handlePort = (port: chrome.runtime.Port) => {
  if (port.name == DEVTOOL_RUNTIME_CONNECTION_PORT) {
    handleDevtoolPort(port)
  } else if (port.name == CONTENT_SCRIPT_RUNTIME_CONNECTION_PORT) {
    handleContentScriptPort(port)
  }
}

chrome.runtime.onConnect.addListener(handlePort)
