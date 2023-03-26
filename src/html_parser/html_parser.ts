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

  // Push the target and its ancestors to the stack
  while (currentElement) {
    stack.push(currentElement)
    currentElement = currentElement.parentElement
  }

  // Initialize the result variable and the closingTags stack
  let result = ""
  const closingTags: string[] = []

  // Process each element in the stack
  while (stack.length > 0) {
    const element = stack.pop()!
    const tagName = element.tagName.toLowerCase()

    // Append the opening tag to the result
    let openingTag = `<${tagName}`
    for (const attr of element.attributes) {
      openingTag += ` ${attr.name}="${attr.value}"`
    }
    openingTag += ">"
    result += openingTag

    // If it's the target element, include its content
    if (element === target) {
      result += element.innerHTML
    }

    // Push the closing tag to the closingTags stack
    closingTags.push(`</${tagName}>`)
  }

  // Append the closing tags to the result
  while (closingTags.length > 0) {
    result += closingTags.pop()!
  }

  return result
}
