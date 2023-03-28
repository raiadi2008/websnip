import { pseudoClassRegex } from "../constants/constants"

const getCssTextWithoutSelectors = (cssText: string) => {
  const openingBraceIndex = cssText.indexOf("{")
  const closingBraceIndex = cssText.lastIndexOf("}")
  let cssProps: string = null
  if (
    openingBraceIndex >= 0 &&
    closingBraceIndex >= 0 &&
    closingBraceIndex > openingBraceIndex
  ) {
    cssProps = cssText
      .substring(openingBraceIndex, closingBraceIndex + 1)
      .trim()
  }

  return cssProps
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

const isPseudoClass = (element: HTMLElement, selectorText: string): string => {
  const selectorsArray: string[] = selectorText.split(",")
  const pseudoSelectors = new Set<string>()
  for (const selector of selectorsArray) {
    if (element.matches(selector)) {
      const match = selectorText.match(pseudoClassRegex)
      match.forEach((value) => pseudoSelectors.add(value))
    }
  }
  if (pseudoSelectors.size > 0) {
    return Array.from(pseudoSelectors).join(":")
  }
  return null
}

export const collectCssRules = (
  element: HTMLElement,
  classMap: Map<string, string>,
  cssRules: string[] = []
): string[] => {
  // Collect CSS rules from stylesheets
  for (const stylesheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(stylesheet.cssRules)) {
        if (
          rule instanceof CSSStyleRule &&
          element.matches(rule.selectorText)
        ) {
          console.log(rule)
          const appliedPseudo = isPseudoClass(element, rule.selectorText)

          const cssProps = getCssTextWithoutSelectors(rule.cssText)
          let selector = `.${classMap[element.className]}`
          if (appliedPseudo) {
            selector = `${selector}:${appliedPseudo}`
          }
          cssRules.push(`${selector}${cssProps}`)
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
    collectCssRules(child as HTMLElement, classMap, cssRules)
  }
  return cssRules
}
