import React from "react"
import { createRoot } from "react-dom/client"
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
    const port = chrome.runtime.connect({ name: "devtoolPort" })
  }
)
