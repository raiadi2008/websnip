import React from "react"
import { createRoot } from "react-dom/client"
import { DEVTOOL_RUNTIME_CONNECTION_PORT } from "../utils/constants"
import DevtoolsPanel from "./devtools_panel"
import { HtmlCssInfo } from "../types/props"
import { OverlayActivatorInterface } from "../types/types"

const domNode = document.createElement("div")
domNode.textContent = "devtools"
const root = createRoot(domNode)
root.render(<DevtoolsPanel />)

chrome.devtools.panels.create(
  "Websnip",
  "icon.png",
  "devtools.html",
  (panel: chrome.devtools.panels.ExtensionPanel) => {
    const tabID = chrome.devtools.inspectedWindow.tabId
    const port = chrome.runtime.connect({
      name: DEVTOOL_RUNTIME_CONNECTION_PORT,
    })
    port.onMessage.addListener(
      (message: HtmlCssInfo, port: chrome.runtime.Port) => {
        root.render(<DevtoolsPanel html={message.html} css={message.css} />)
      }
    )
    panel.onShown.addListener(() => {
      port.postMessage({ activate_overlay: true } as OverlayActivatorInterface)
    })
    panel.onHidden.addListener(() => {
      port.postMessage({ activate_overlay: false } as OverlayActivatorInterface)
    })
  }
)
