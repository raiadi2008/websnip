import { HtmlCssInfo } from "../types/props"
import { HtmlCssInfoInterface, OverlayActivatorInterface } from "../types/types"
import {
  CONTENT_SCRIPT_RUNTIME_CONNECTION_PORT,
  DEVTOOL_RUNTIME_CONNECTION_PORT,
} from "../utils/constants"

const handleDevtoolPort = (port: chrome.runtime.Port) => {
  port.onMessage.addListener((message: OverlayActivatorInterface) => {
    console.log(message)
  })
  port.onDisconnect.addListener((port) => {
    port.disconnect()
  })
}

const handleContentScriptPort = (port: chrome.runtime.Port) => {
  port.onMessage.addListener((message: HtmlCssInfoInterface) => {
    console.log(message)
  })
  port.onDisconnect.addListener((port) => {
    port.disconnect()
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
