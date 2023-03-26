import { collectCssRules } from "../css_parser/css_parser"
import {
  getAncestorHtml,
  getAncestorSelector,
} from "../html_parser/html_parser"
import { HtmlCssInfoInterface, OverlayActivatorInterface } from "../types/types"
import { CONTENT_SCRIPT_RUNTIME_CONNECTION_PORT } from "../utils/constants"

// set the overlay enable false for the
// current window unless stated by devtools
window.__IS_OVERLAY_ENABLED__ = false

// overlay element to display
let overlay: HTMLElement = null

const contentScriptPort = chrome.runtime.connect({
  name: CONTENT_SCRIPT_RUNTIME_CONNECTION_PORT,
})

contentScriptPort.onMessage.addListener(
  (message: OverlayActivatorInterface) => {
    window.__IS_OVERLAY_ENABLED__ = message.activate_overlay
  }
)

function createOverlay() {
  const div = document.createElement("div")
  div.style.position = "fixed"
  div.style.pointerEvents = "none"
  div.style.border = "1px solid #00f"
  div.style.background = "rgba(0, 0, 255, 0.1)"
  div.style.zIndex = "999999"
  return div
}

function updateOverlayPosition(bounds) {
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

function onClick(event) {
  if (!window.__IS_OVERLAY_ENABLED__) return
  event.preventDefault()
  event.stopPropagation()
  const target = event.target
  const outerHTML = getAncestorHtml(target)

  const cssRules = collectCssRules(target)

  // Add computed width and height
  const computedStyle = window.getComputedStyle(target)
  const width = computedStyle.width
  const height = computedStyle.height
  const selector = getAncestorSelector(target)
  cssRules.push(
    `/* Computed width and height */\n${selector} { width: ${width}; height: ${height}; }`
  )

  if (contentScriptPort && contentScriptPort.sender) {
    contentScriptPort.postMessage({
      html: outerHTML,
      css: cssRules.join(" "),
    } as HtmlCssInfoInterface)
  }

  // // Send the HTML and CSS to the background script
  // // const port = chrome.runtime.connect({ name: 'elementSelected' });
  // // port.postMessage({
  // //     action: 'elementSelected',
  // //     element: target.tagName.toLowerCase(),
  // //     html: outerHTML,
  // //     css: cssRules.join('\n'),
  // // });

  // console.log(outerHTML)
  // console.log(cssRules)
}

const init = () => {
  overlay = createOverlay()
  document.addEventListener("mouseover", onMouseOver)
  document.addEventListener("mouseout", onMouseOut)
  document.addEventListener("click", onClick)
}
init()
