import { MessageTypes } from "./enums"
import { OverlayActivatorInterface, RespondTabIdInfoInterface } from "./types"

export function isOverlayActivatorMessage(
  message: OverlayActivatorInterface | RespondTabIdInfoInterface
): message is OverlayActivatorInterface {
  return message.message_type === MessageTypes.OVERLAY_ACTIVATOR_MESSAGE
}
