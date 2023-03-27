import { VOID_ELEMENTS } from "../constants/constants"

export function getAncestorSelector(element: HTMLElement | null): string {
  const segments: string[] = []
  while (element && element.nodeType === Node.ELEMENT_NODE) {
    let segment = element.tagName.toLowerCase()
    if (element.id) {
      segment += "#" + element.id
    }
    if (element.className) {
      segment += "." + element.className.trim().replace(/\s+/g, ".")
    }
    segments.unshift(segment)
    element = element.parentElement
  }
  return segments.join(" > ")
}

export function getAncestorHtml(target: HTMLElement): string {
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
