import React, { useState } from 'react'
import './CollapsibleSection.css'

function CollapsibleSection({ title, children, defaultExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="collapsible-section">
      <button 
        className="collapsible-header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="collapsible-title">{title}</span>
        <span className="collapsible-icon">{isExpanded ? '▼' : '▶'}</span>
      </button>
      {isExpanded && (
        <div className="collapsible-content">
          {children}
        </div>
      )}
    </div>
  )
}

export default CollapsibleSection

