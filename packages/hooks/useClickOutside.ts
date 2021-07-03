import React, { useEffect, useRef } from 'react'

const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  callback: (event: MouseEvent) => void,
  eventType: string = 'click',
) => {
  const handlerRef = useRef(callback)

  useEffect(() => {
    handlerRef.current = callback
  })

  useEffect(() => {
    const listener = (event: MouseEvent & { target: Element }) => {
      if (ref && ref.current) {
        if (event.target.shadowRoot) {
          if (!event.target.shadowRoot.contains(ref.current)) {
            handlerRef.current(event)
          }
        } else {
          if (!ref.current.contains(event.target)) {
            handlerRef.current(event)
          }
        }
      }
    }

    document.addEventListener(eventType, listener)

    return () => {
      document.removeEventListener(eventType, listener)
    }
  })
}

export default useClickOutside
