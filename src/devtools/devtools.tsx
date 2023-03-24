import React from "react"
import { createRoot } from "react-dom/client"
import { DEVTOOL_RUNTIME_CONNECTION_PORT } from "../utils/constants"
console.log("devtools running")

const domNode = document.createElement("div")
domNode.textContent = "devtools"
const root = createRoot(domNode)
root.render(<h1>Hello</h1>)

chrome.devtools.panels.create(
  "Websnip",
  "icon.png",
  "devtools.html",
  (panel: chrome.devtools.panels.ExtensionPanel) => {
    const tabID = chrome.devtools.inspectedWindow.tabId
    const port = chrome.runtime.connect({
      name: DEVTOOL_RUNTIME_CONNECTION_PORT,
    })
    panel.onShown.addListener(() => {
      port.postMessage(`opened devtools on tab ${tabID}`)
    })
    panel.onHidden.addListener(() => {
      port.postMessage(`closed devtools on tab ${tabID}`)
    })
  }
)
