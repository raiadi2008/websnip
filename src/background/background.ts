import {
  CONTENT_SCRIPT_RUNTIME_CONNECTION_PORT,
  DEVTOOL_RUNTIME_CONNECTION_PORT,
} from "../utils/constants"

chrome.runtime.onConnect.addListener((port) => {
  if (port.name == DEVTOOL_RUNTIME_CONNECTION_PORT) {
    port.onMessage.addListener((message) => {})
    port.onDisconnect.addListener((port) => {})
  } else if (port.name == CONTENT_SCRIPT_RUNTIME_CONNECTION_PORT) {
    port.onMessage.addListener((message) => {})
    port.onDisconnect.addListener((port) => {})
  }
})
