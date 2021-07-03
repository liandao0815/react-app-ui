import React from 'react'
import ReactDOM from 'react-dom'

const usePortal = (
  children: React.ReactNode,
  container?: HTMLElement,
): React.ReactPortal => {
  const defaultNodeRef = React.useRef<HTMLElement | null>(null)

  React.useEffect(
    () => () => {
      if (defaultNodeRef.current) {
        document.body.removeChild(defaultNodeRef.current)
      }
    },
    [],
  )

  if (!container && !defaultNodeRef.current) {
    const defaultNode = document.createElement('div')
    defaultNode.className = 'react-app-ui__portal'
    defaultNodeRef.current = defaultNode
    document.body.appendChild(defaultNode)
  }

  return ReactDOM.createPortal(children, (container || defaultNodeRef.current)!)
}

export default usePortal
