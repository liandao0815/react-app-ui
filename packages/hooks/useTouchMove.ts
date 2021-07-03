import React, { useEffect, useRef } from 'react'
import useEventListener from './useEventListener'

const useTouchMove = (
  ref: React.RefObject<HTMLElement>,
  callback: (direction: number) => void,
) => {
  const distanceRef = useRef<number>(null)
  const slideingRef = useRef(false)
  const handlerRef = useRef(callback)
  const needMoveDistance = Math.floor(document.documentElement.clientWidth / 5)

  useEffect(() => {
    handlerRef.current = callback
  })

  const touchStart = (event: TouchEvent) => {
    const touch = event.targetTouches[0]
    distanceRef.current = touch.pageX
  }

  const touchMove = (event: TouchEvent) => {
    if (slideingRef.current) return false

    const touch = event.targetTouches[0]
    const direction = touch.pageX - distanceRef.current

    if (Math.abs(direction) >= needMoveDistance) {
      slideingRef.current = true
      distanceRef.current = null
      handlerRef.current(direction)
    }
    event.preventDefault()
  }

  const touchEnd = () => {
    slideingRef.current = false
  }

  useEventListener(ref, 'touchstart', touchStart)
  useEventListener(ref, 'touchmove', touchMove)
  useEventListener(ref, 'touchend', touchEnd)
}

export default useTouchMove
