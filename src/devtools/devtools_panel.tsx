import React from "react"
import { HtmlCssInfo } from "../types/props"
import AceEditor from "react-ace"
import prettier from "prettier/standalone"
import parserHtml from "prettier/parser-html"
import parserCss from "prettier/parser-postcss"

import "./styles/devtools_panel.css"

const DevtoolsPanel: React.FC<HtmlCssInfo> = ({ html, css }) => {
  let parsedHTML = prettier.format(html || "Your HTML goes here ...", {
    parser: "html",
    plugins: [parserHtml],
  })
  let parsedCSS = prettier.format(css || "Your CSS goes here ...", {
    parser: "css",
    plugins: [parserCss],
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
          height='200px'
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
          height='200px'
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
