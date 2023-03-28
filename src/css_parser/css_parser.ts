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

export function collectCssRules(
  element: HTMLElement,
  cssRules: string[] = []
): string[] {
  // Collect CSS rules from stylesheets
  for (const stylesheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(stylesheet.cssRules)) {
        if (
          rule instanceof CSSStyleRule &&
          element.matches(rule.selectorText)
        ) {
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
    const selector = getAncestorSelector(element)
    cssRules.push(`/* Inline styles */\n${selector} { ${inlineStyle} }`)
  }

  // Recursively collect CSS rules for child elements
  for (const child of Array.from(element.children)) {
    collectCssRules(child as HTMLElement, cssRules)
  }

  return cssRules
}
