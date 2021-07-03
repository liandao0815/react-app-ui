import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import classnames from 'classnames'
import { useEventListener } from '../hooks'
import { noop } from '../utils'
import './index.less'

export type ScrollMenuOption = {
  label: string
  title: string
}

export type ScrollMenuProps = Readonly<
  {
    options: ScrollMenuOption[]
    children?: React.ReactNode
    className?: string
    style?: React.CSSProperties
  } & Partial<typeof defaultProps>
>

export type ScrollMenuRef = Readonly<{
  refresh: () => void
}>

const defaultProps = {
  activeIndex: 0,
  sticky: false,
  onMenuClick: noop as (index: number) => void,
}

const ScrollMenu = React.forwardRef<ScrollMenuRef, ScrollMenuProps>(
  (props, ref) => {
    const {
      options,
      activeIndex,
      sticky,
      children,
      onMenuClick,
      className,
      style,
    } = props

    const boxContentRef = useRef<HTMLUListElement>(null)
    const [contentScrollTop, setContentScrollTop] = useState(0)
    const [contentItemHeights, setContentItemHeights] = useState<number[]>([])

    const currenMenuIndex = useMemo(() => {
      const index = contentItemHeights.findIndex((_, index) => {
        return (
          contentScrollTop >= contentItemHeights[index] &&
          contentScrollTop < contentItemHeights[index + 1]
        )
      })
      return index > 0 ? index : 0
    }, [contentScrollTop, contentItemHeights])

    const compClsPrefix = 'react-app-ui-scroll-menu'
    const compClsName = classnames(compClsPrefix, className)

    const onBoxContentScroll = (e: Event) => {
      setContentScrollTop((e.target as HTMLUListElement).scrollTop)
    }

    const onMenuItemClick = useCallback(
      (index: number, isInitiative?: boolean) => {
        const scrollTop = contentItemHeights[index]
        boxContentRef.current.scrollTop = scrollTop
        setTimeout(() => setContentScrollTop(scrollTop), 20)

        isInitiative && onMenuClick(index)
      },
      [contentItemHeights, onMenuClick],
    )

    const calcItemHeights = useCallback(() => {
      if (boxContentRef.current) {
        const contentItems = boxContentRef.current.querySelectorAll(
          `.${compClsPrefix}-box__item`,
        )
        setContentItemHeights(() =>
          [...contentItems].reduce(
            (prev, cur) => [...prev, prev[prev.length - 1] + cur.clientHeight],
            [0],
          ),
        )
      }
    }, [])

    useEffect(() => {
      activeIndex && onMenuItemClick(activeIndex)
    }, [activeIndex, onMenuItemClick])

    useEffect(calcItemHeights, [calcItemHeights])

    useImperativeHandle(ref, () => ({
      refresh: () => calcItemHeights(),
    }))

    useEventListener(boxContentRef, 'scroll', onBoxContentScroll)

    return (
      <div className={compClsName} style={style}>
        <ul className={compClsPrefix + '-nav'}>
          {options.map((option, index) => (
            <li
              key={index}
              className={classnames(`${compClsPrefix}-nav__label`, {
                [`${compClsPrefix}-nav__label--active`]:
                  index === currenMenuIndex,
              })}
              onClick={onMenuItemClick.bind(null, index, true)}
            >
              {option.label}
            </li>
          ))}
        </ul>
        <ul className={compClsPrefix + '-box'} ref={boxContentRef}>
          {options.map((option, index) => (
            <li className={compClsPrefix + '-box__item'} key={index}>
              <div
                className={classnames(`${compClsPrefix}-box__item--title`, {
                  [`${compClsPrefix}-box__item--title--sticky`]: sticky,
                })}
              >
                {option.title}
              </div>
              <div className={compClsPrefix + '-box__item--content'}>
                {children?.[index]}
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  },
)

ScrollMenu.defaultProps = defaultProps

export default ScrollMenu
