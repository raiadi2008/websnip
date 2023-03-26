import { HtmlCssInfo } from "../types/props"
import { HtmlCssInfoInterface, OverlayActivatorInterface } from "../types/types"
import {
  CONTENT_SCRIPT_RUNTIME_CONNECTION_PORT,
  DEVTOOL_RUNTIME_CONNECTION_PORT,
} from "../utils/constants"

let devtoolPort: chrome.runtime.Port
let contentScriptPort: chrome.runtime.Port

chrome.runtime.onConnect.addListener((port) => {
  if (port.name == DEVTOOL_RUNTIME_CONNECTION_PORT) {
    devtoolPort = port
    port.onMessage.addListener((message: OverlayActivatorInterface) => {
      if (contentScriptPort) {
        contentScriptPort.postMessage(message)
      }
    })
    port.onDisconnect.addListener((port) => {
      port.disconnect()
    })
  } else if (port.name == CONTENT_SCRIPT_RUNTIME_CONNECTION_PORT) {
    contentScriptPort = port
    port.onMessage.addListener((message: HtmlCssInfoInterface) => {
      if (devtoolPort) {
        devtoolPort.postMessage(message)
      }
    })
    port.onDisconnect.addListener((port) => {
      port.disconnect()
    })
  }
})
