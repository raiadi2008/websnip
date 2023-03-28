import { VOID_ELEMENTS } from "../constants/constants"

export const getAncestorHtml = (target: HTMLElement): string => {
  const stack: HTMLElement[] = []
  let currentElement: HTMLElement | null = target

  while (currentElement) {
    stack.push(currentElement)
    currentElement = currentElement.parentElement
  }

  let result = ""
  const closingTags: string[] = []

  while (stack.length > 0) {
    const element = stack.pop()!
    const tagName = element.tagName.toLowerCase()
    const isVoidElement = VOID_ELEMENTS.includes(tagName)

    let openingTag = `<${tagName}`
    for (const attr of element.attributes) {
      openingTag += ` ${attr.name}="${attr.value}"`
    }
    openingTag += isVoidElement ? "/>" : ">"
    result += openingTag

    if (element === target && !isVoidElement) {
      result += element.innerHTML
    }

    if (!isVoidElement) {
      closingTags.push(`</${tagName}>`)
    }
  }

  while (closingTags.length > 0) {
    result += closingTags.pop()!
  }

  return result
}
