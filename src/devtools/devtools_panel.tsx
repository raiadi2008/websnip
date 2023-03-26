import React from "react"
import { HtmlCssInfo } from "../types/props"
import AceEditor from "react-ace"
import prettier from "prettier/standalone"
import parserHtml from "prettier/parser-html"
import parserCss from "prettier/parser-postcss"
import "ace-builds/src-noconflict/theme-monokai"

import "./styles/devtools_panel.css"

const DevtoolsPanel: React.FC<HtmlCssInfo> = ({ html, css }) => {
  let parsedHTML = html || "Your HTML goes here ..."
  let parsedCSS = css || "Your CSS goes here ..."

  // Check if the CSS contains valid rules
  const isValidCSS = (css: string) => {
    return css.trim() !== "Your CSS goes here ..."
  }

  if (isValidCSS(parsedCSS)) {
    parsedCSS = prettier.format(css || "Your CSS goes here ...", {
      parser: "css",
      plugins: [parserCss],
    })
  }

  parsedHTML = prettier.format(html || "Your HTML goes here ...", {
    parser: "html",
    plugins: [parserHtml],
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {},
      (err) => {}
    )
  }

  return (
    <div className='devtools-panel'>
      <div className='sandbox'>
        <div className='sandbox-heading'>HTML</div>
        <AceEditor
          mode='html'
          theme='monokai'
          name='html-editor'
          value={parsedHTML}
          readOnly={true}
          width='100%'
          height='80%'
        />
        <button
          className='copy-button'
          onClick={() => copyToClipboard(parsedHTML)}
        >
          Copy
        </button>
      </div>
      <div className='sandbox'>
        <div className='sandbox-heading'>CSS</div>
        <AceEditor
          mode='css'
          theme='monokai'
          name='css-editor'
          value={parsedCSS}
          readOnly={true}
          width='100%'
          height='80%'
        />
        <button
          className='copy-button'
          onClick={() => copyToClipboard(parsedCSS)}
        >
          Copy
        </button>
      </div>
    </div>
  )
}

export default DevtoolsPanel
