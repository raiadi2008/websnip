import { CONTENT_SCRIPT_RUNTIME_CONNECTION_PORT } from "../utils/constants"

const contentScriptPort = chrome.runtime.connect({
  name: CONTENT_SCRIPT_RUNTIME_CONNECTION_PORT,
})

const onMouseOver = (mouseEvent: MouseEvent) => {
  contentScriptPort.postMessage(mouseEvent.target)
}
const init = () => {
  document.addEventListener("mouseover", onMouseOver)
}
init()
