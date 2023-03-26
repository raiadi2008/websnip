import React from "react"
import { HtmlCssInfo } from "../types/props"

const DevtoolsPanel: React.FC<HtmlCssInfo> = ({ html, css }) => {
  let parsedHTML = html || "Your HTML goes here ..."
  let parsedCSS = css || "Your CSS goes here ..."
  return (
    <div className='devtools-panel'>
      <div className='sandbox'>
        <div className='sandbox-heading'>HTML</div>
        <div className='sandbox-code'>{parsedHTML}</div>
      </div>
      <div className='sandbox'>
        <div className='sandbox-heading'>CSS</div>
        <div className='sandbox-code'>{parsedCSS}</div>
      </div>
    </div>
  )
}

export default DevtoolsPanel
