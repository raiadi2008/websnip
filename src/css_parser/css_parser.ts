import { v4 as uuidv4 } from "uuid"

const genrateRandomClassNames = (): string => {
  return `websnip-genrated-class-${uuidv4().substr(0, 10)}`
}

const getAncestorSelector = (element: HTMLElement | null): string => {
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

export const collectCssRules = (
  element: HTMLElement,
  cssRules: string[],
  classMap: Map<string, string[]>
): void => {
  // Collect CSS rules from stylesheets
  const classNames: string[] = []
  for (const stylesheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(stylesheet.cssRules)) {
        if (
          rule instanceof CSSStyleRule &&
          element.matches(rule.selectorText)
        ) {
          const randomClassName = genrateRandomClassNames()
          classNames.push(randomClassName)
          cssRules.push(rule.cssText)
        }
      }
    } catch (error) {
      // Ignore errors due to CORS restrictions
    }
  }

  // Collect inline styles
  if (element.hasAttribute("style")) {
    const inlineStyle = element.getAttribute("style")!
    const randomClassName = genrateRandomClassNames()
    classNames.push(randomClassName)
    cssRules.push(`/* Inline styles */\n${randomClassName} { ${inlineStyle} }`)
  }
  classMap.set(element.className, classNames)
  // Recursively collect CSS rules for child elements
  for (const child of Array.from(element.children)) {
    collectCssRules(child as HTMLElement, cssRules, classMap)
  }
}
