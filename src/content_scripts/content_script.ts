import { collectCssRules } from "../css_parser/css_parser"
import { getAncestorHtml } from "../html_parser/html_parser"
import {
  HtmlCssInfoInterface,
  OverlayActivatorInterface,
  RespondTabIdInfoInterface,
} from "../types/types"
import { CONTENT_SCRIPT_RUNTIME_CONNECTION_PORT } from "../constants/constants"
import { MessageTypes } from "../types/enums"
import { isOverlayActivatorMessage } from "../types/type_gaurds"

// set the overlay enable false for the
// current window unless stated by devtools
window.__IS_OVERLAY_ENABLED__ = false

// overlay element to display
let overlay: HTMLElement = null

const contentScriptPort = chrome.runtime.connect({
  name: CONTENT_SCRIPT_RUNTIME_CONNECTION_PORT,
})

contentScriptPort.onMessage.addListener(
  (message: OverlayActivatorInterface | RespondTabIdInfoInterface) => {
    if (isOverlayActivatorMessage(message)) {
      window.__IS_OVERLAY_ENABLED__ = message.activate_overlay
      if (!message.activate_overlay) {
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay)
        }
      }
    } else if (message.message_type === MessageTypes.RESPOND_TAB_ID_MESSAGE)
      window.__CURRENT_WINDOW_TAB_ID__ = message.tabId
  }
)

const createOverlay = (): HTMLElement => {
  const div = document.createElement("div")
  div.style.position = "fixed"
  div.style.pointerEvents = "none"
  div.style.border = "1px solid #00f"
  div.style.background = "rgba(0, 0, 255, 0.1)"
  div.style.zIndex = "999999"
  return div
}

const updateOverlayPosition = (bounds: DOMRect) => {
  overlay.style.top = `${bounds.top}px`
  overlay.style.left = `${bounds.left}px`
  overlay.style.width = `${bounds.width}px`
  overlay.style.height = `${bounds.height}px`
}

const onMouseOver = (mouseEvent: MouseEvent) => {
  if (!window.__IS_OVERLAY_ENABLED__) return
  const target = event.target as HTMLElement
  const bounds = target.getBoundingClientRect()
  updateOverlayPosition(bounds)
  document.body.appendChild(overlay)
}

const onMouseOut = (mouseEvent: MouseEvent) => {
  if (!window.__IS_OVERLAY_ENABLED__) return
  if (overlay && overlay.parentNode) {
    overlay.parentNode.removeChild(overlay)
  }
}

const onClick = (event: MouseEvent) => {
  if (!window.__IS_OVERLAY_ENABLED__) return
  event.preventDefault()
  event.stopPropagation()
  const target = event.target as HTMLElement
  const cssRules: string[] = []
  const classMap = new Map<string, string[]>()
  collectCssRules(target, cssRules, classMap)

  console.log("classMap", classMap)
  console.log("cssRules", cssRules)

  // Add computed width and height
  const computedStyle = window.getComputedStyle(target)
  const width = computedStyle.width
  const height = computedStyle.height

  if (contentScriptPort) {
    contentScriptPort.postMessage({
      message_type: MessageTypes.HTML_CSS_INFO_MESSAGE,
      html: target.outerHTML,
      css: cssRules.join(" "),
      tabId: window.__CURRENT_WINDOW_TAB_ID__,
    } as HtmlCssInfoInterface)
  }
}

const init = () => {
  overlay = createOverlay()
  document.addEventListener("mouseover", onMouseOver)
  document.addEventListener("mouseout", onMouseOut)
  document.addEventListener("click", onClick, { capture: true })
}
init()
