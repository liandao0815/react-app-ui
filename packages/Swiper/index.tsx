import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import classnames from 'classnames'
import { noop, transformUnit } from '../utils'
import './index.less'

export type SwiperProps = Readonly<
  Partial<typeof defaultProps> & React.HTMLAttributes<HTMLDivElement>
>

export type SwiperRef = Readonly<{
  slidePrev: (forward?: boolean) => void
  slideNext: (backward?: boolean) => void
  slideTo: (index: number) => void
  getCurrentIndex: () => number
  startPlay: () => void
  pausePlay: () => void
}>

const defaultProps = {
  direction: 'horizontal' as 'horizontal' | 'vertical',
  defaultIndex: 0,
  speed: 0.4,
  velocityThreshold: 0.3,
  distanceThreshold: 0.5,
  interval: 3000,
  loop: true,
  autoplay: false,
  timingFunction: 'ease',
  onSwiped: noop as (index: number, dir: number) => void,
}

const Swiper = React.forwardRef<SwiperRef, SwiperProps>((props, ref) => {
  const {
    direction,
    defaultIndex,
    speed,
    velocityThreshold,
    distanceThreshold,
    interval,
    loop,
    autoplay,
    timingFunction,
    onSwiped,
    className,
    children,
    ...restProps
  } = props

  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const timerIDRef = useRef<number>(0)

  const [activeIndex, setActiveIndex] = useState(
    loop ? defaultIndex + 1 : defaultIndex,
  )
  const [playing, setPalying] = useState(autoplay)
  const [animating, setAnimating] = useState(false)
  const [delta, setDelta] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [startPosition, setStartPosition] = useState(0)
  const [swiperRect, setSwiperRect] = useState({ width: 0, height: 0 })

  const compClsPrefix = 'react-app-ui-swiper'
  const compClsName = classnames(compClsPrefix, className)
  const swiperCount = React.Children.count(children)
  const childrenArr = React.Children.toArray(children)

  const dimension = useMemo(
    () => (direction === 'horizontal' ? swiperRect.width : swiperRect.height),
    [swiperRect, direction],
  )

  const getCurrentIndex = useCallback(
    (index = activeIndex) => {
      return loop ? index - 1 : index
    },
    [activeIndex, loop],
  )

  const transformStyle = useCallback(
    (offset: number, animate = false) => {
      const transform =
        direction === 'horizontal'
          ? `translate3d(${transformUnit(offset)}, 0, 0)`
          : `translate3d(0, ${transformUnit(offset)}, 0)`
      const transition = animate
        ? `transform ${speed}s ${timingFunction}`
        : 'none'

      return `transform: ${transform}; transition: ${transition};`
    },
    [direction, speed, timingFunction],
  )

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (animating) return

    setDelta(0)
    setStartTime(Date.now())
    setStartPosition(
      event.touches[0][direction === 'horizontal' ? 'pageX' : 'pageY'],
    )

    setTimeout(() => {
      playing && pausePlay(false)
    }, speed * 1000)
  }

  const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (animating) return

    const _delta =
      event.touches[0][direction === 'horizontal' ? 'pageX' : 'pageY'] -
      startPosition

    wrapperRef.current &&
      (wrapperRef.current.style.cssText = `
        ${wrapperRef.current.style.cssText}
        ${transformStyle(-activeIndex * dimension + delta)}
      `)
    setDelta(_delta)
  }

  const onTouchEnd = () => {
    if (animating || !delta) return

    const velocity = delta / (Date.now() - startTime)
    const absDelta = Math.abs(delta)
    const absVelocity = Math.abs(velocity)
    const condition =
      absDelta >= distanceThreshold * dimension ||
      absVelocity >= velocityThreshold

    if (delta > 0 && condition) {
      !loop && activeIndex <= 0 ? slideTo(activeIndex) : slidePrev(false)
    } else if (delta < 0 && condition) {
      !loop && activeIndex >= swiperCount - 1
        ? slideTo(activeIndex)
        : slideNext(false)
    } else {
      slideTo(activeIndex)
    }

    playing && startPlay()
  }

  const slideTo = useCallback(
    (index: number) => {
      if (speed > 0) setAnimating(true)

      wrapperRef.current &&
        (wrapperRef.current.style.cssText = `
        ${wrapperRef.current.style.cssText}
        ${transformStyle(-index * dimension, true)}
      `)

      window.setTimeout(() => {
        let _index = index
        if (loop) {
          index === 0 && (_index = swiperCount)
          index === swiperCount + 1 && (_index = 1)
        }

        wrapperRef.current &&
          (wrapperRef.current.style.cssText = `
          ${wrapperRef.current.style.cssText}
          ${transformStyle(-_index * dimension)}
        `)
        setAnimating(false)
        setActiveIndex(_index)

        _index !== activeIndex &&
          onSwiped(getCurrentIndex(_index), index - activeIndex)
      }, speed * 1000)
    },
    [
      activeIndex,
      dimension,
      getCurrentIndex,
      loop,
      onSwiped,
      speed,
      swiperCount,
      transformStyle,
    ],
  )

  const slidePrev = useCallback(
    (forward = true) => {
      if (animating) return

      if (!loop && activeIndex <= 0) {
        forward && slideTo(swiperCount - 1)
        return
      }
      slideTo(activeIndex - 1)
    },
    [activeIndex, animating, loop, slideTo, swiperCount],
  )

  const slideNext = useCallback(
    (backward = true) => {
      if (animating) return

      if (!loop && activeIndex >= swiperCount - 1) {
        backward && slideTo(0)
        return
      }
      slideTo(activeIndex + 1)
    },
    [activeIndex, animating, loop, slideTo, swiperCount],
  )

  const pausePlay = useCallback((clearStatus = true) => {
    clearStatus && setPalying(false)
    window.clearInterval(timerIDRef.current)
  }, [])

  const startPlay = useCallback(() => {
    pausePlay()
    setPalying(true)
    timerIDRef.current = window.setInterval(() => {
      slideNext()
    }, interval)
  }, [pausePlay, interval, slideNext])

  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth
      const height = containerRef.current.offsetHeight

      if (wrapperRef.current) {
        if (direction === 'horizontal') {
          wrapperRef.current.style.cssText = `
            display: flex;
            width: ${transformUnit(
              (loop ? swiperCount + 2 : swiperCount) * width,
            )};
            ${transformStyle(-(loop ? defaultIndex + 1 : defaultIndex) * width)}
          `
        }
        if (direction === 'vertical') {
          wrapperRef.current.style.cssText = `
            display: block;
            height: ${transformUnit(
              (loop ? swiperCount + 2 : swiperCount) * height,
            )};
            ${transformStyle(
              -(loop ? defaultIndex + 1 : defaultIndex) * height,
            )}
          `
        }
      }
      setSwiperRect({ width, height })
    }
  }, [defaultIndex, direction, swiperCount, loop, transformStyle])

  useEffect(() => {
    playing && startPlay()
    return pausePlay
  }, [playing, startPlay, pausePlay])

  useImperativeHandle(ref, () => ({
    slidePrev,
    slideNext,
    slideTo,
    getCurrentIndex,
    startPlay,
    pausePlay,
  }))

  return (
    <div
      className={compClsName}
      {...restProps}
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className={compClsName + '__wrapper'} ref={wrapperRef}>
        {(loop
          ? [childrenArr[swiperCount - 1], ...childrenArr, childrenArr[0]]
          : childrenArr
        ).map((child, index) =>
          React.cloneElement(child as React.ReactElement, {
            style: {
              ...(child as React.ReactElement).props.style,
              width: transformUnit(swiperRect.width),
              height: transformUnit(swiperRect.height),
            },
            key: index,
          }),
        )}
      </div>
    </div>
  )
})

Swiper.defaultProps = defaultProps

export default Swiper
