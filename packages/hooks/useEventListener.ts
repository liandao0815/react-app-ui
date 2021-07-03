import { useEffect, useRef } from 'react'

const useEventListener = (
  ref: React.RefObject<HTMLElement> | HTMLElement | Window,
  eventType: string,
  callback: (event: Event) => void,
  options?: boolean | EventListenerOptions,
) => {
  const handlerRef = useRef(callback)

  useEffect(() => {
    handlerRef.current = callback
  })

  useEffect(() => {
    const eventListener = (event: Event) => handlerRef.current(event)
    const element =
      ref instanceof HTMLElement || ref instanceof Window ? ref : ref.current

    element.addEventListener(eventType, eventListener, options)

    const clean = () => {
      element.removeEventListener(eventType, eventListener, options)
    }
    return clean
  })
}

export default useEventListener
