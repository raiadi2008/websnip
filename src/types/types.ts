import { MessageTypes } from "./enums"

export interface HtmlCssInfoInterface {
  message_type: MessageTypes
  html: string
  css: string
  tabId?: number
}

export interface OverlayActivatorInterface {
  message_type: MessageTypes
  activate_overlay: boolean
  tabId?: number
}

export interface RequestTabIdInfoInterface {
  message_type: MessageTypes
}

export interface RespondTabIdInfoInterface {
  message_type: MessageTypes
  tabId: number
}

export interface HtmlClassInfoInterface {
  html: string
  class_map: Map<string, string>
}
