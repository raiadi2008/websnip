import { collectCssRules } from "../css_parser/css_parser"
import { getAncestorHtml } from "../html_parser/html_parser"

export function findStaticResources(
  html: string,
  cssRules: string[]
): string[] {
  const urls: Set<string> = new Set()

  // Find resources in HTML (e.g., img src)
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")
  const images = doc.querySelectorAll("img")
  for (const img of Array.from(images)) {
    const src = img.getAttribute("src")
    if (src) {
      urls.add(src)
    }
  }

  // Find resources in CSS (e.g., background-image)
  const cssUrlRegex = /url\(['"]?([^'"]+)['"]?\)/g
  for (const cssRule of cssRules) {
    let match
    while ((match = cssUrlRegex.exec(cssRule)) !== null) {
      urls.add(match[1])
    }
  }

  return Array.from(urls)
}

export function downloadResources(urls: string[]): void {
  for (const url of urls) {
    const link = document.createElement("a")
    link.href = url
    link.download = ""
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Example usage:
// const selectedElement = document.querySelector("#some-element") as HTMLElement
// const html = getAncestorHtml(selectedElement)
// const cssRules = collectCssRules(selectedElement)
// const staticResources = findStaticResources(html, cssRules)

// const downloadButton = document.createElement("button")
// downloadButton.textContent = "Download Static Resources"
// downloadButton.addEventListener("click", () => {
//   downloadResources(staticResources)
// })

// document.body.appendChild(downloadButton)
