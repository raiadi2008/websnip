import React from "react"
import { createRoot } from "react-dom/client"
import { DEVTOOL_RUNTIME_CONNECTION_PORT } from "../constants/constants"
import DevtoolsPanel from "./devtools_panel"
import { HtmlCssInfo } from "../types/props"
import {
  HtmlCssInfoInterface,
  OverlayActivatorInterface,
  RespondTabIdInfoInterface,
} from "../types/types"
import { MessageTypes } from "../types/enums"

const domNode = document.createElement("div")
const root = createRoot(domNode)
root.render(<DevtoolsPanel />)
document.body.appendChild(domNode)

chrome.devtools.panels.create(
  "Websnip",
  "icon.png",
  "devtools.html",
  (panel: chrome.devtools.panels.ExtensionPanel) => {
    const tabId = chrome.devtools.inspectedWindow.tabId
    const port = chrome.runtime.connect({
      name: DEVTOOL_RUNTIME_CONNECTION_PORT,
    })
    port.postMessage({
      message_type: MessageTypes.RESPOND_TAB_ID_MESSAGE,
      tabId: chrome.devtools.inspectedWindow.tabId,
    } as RespondTabIdInfoInterface)

    panel.onShown.addListener(() => {
      port.postMessage({
        message_type: MessageTypes.OVERLAY_ACTIVATOR_MESSAGE,
        activate_overlay: true,
        tabId: chrome.devtools.inspectedWindow.tabId,
      } as OverlayActivatorInterface)
    })
    panel.onHidden.addListener(() => {
      port.postMessage({
        message_type: MessageTypes.OVERLAY_ACTIVATOR_MESSAGE,
        activate_overlay: false,
        tabId: chrome.devtools.inspectedWindow.tabId,
      } as OverlayActivatorInterface)
    })

    port.onMessage.addListener(
      (message: HtmlCssInfoInterface, port: chrome.runtime.Port) => {
        root.render(<DevtoolsPanel html={message.html} css={message.css} />)
      }
    )
  }
)
