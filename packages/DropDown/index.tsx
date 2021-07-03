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
import Icon from '../Icon'
import Popup, { PopupPosition, PopupProps, PopupRef } from '../Popup'
import { getScroller, noop } from '../utils'
import './index.less'

export type DropDownDirection = 'down' | 'up'

export type DropDownProps = Readonly<
  {
    label: React.ReactNode
    className?: string
    style?: React.CSSProperties
  } & Partial<typeof defaultProps> &
    Omit<PopupProps, 'position'>
>

const defaultProps = {
  direction: 'down' as DropDownDirection,
  showCaret: true,
  onOpen: noop,
  onClose: noop,
}

const DropDown = React.forwardRef<PopupRef, DropDownProps>((props, ref) => {
  const {
    initVisible,
    label,
    showCaret,
    direction,
    children,
    onOpen,
    onClose,
    className,
    style,
    ...popupProps
  } = props

  const popupRef = useRef<PopupRef>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(initVisible)
  const [offset, setOffset] = useState(0)

  const compClsPrefix = 'react-app-ui-drop-down'
  const compClsName = classnames(compClsPrefix, className)
  const barClsName = classnames(`${compClsName}-bar`, {
    [`${compClsName}-bar--active`]: visible,
  })

  const popupPosition = useMemo(() => {
    let popupPosition: PopupPosition = null

    direction === 'down' && (popupPosition = 'top')
    direction === 'up' && (popupPosition = 'bottom')
    return popupPosition
  }, [direction])

  const popupStyle = useMemo(() => {
    const popupStyle: React.CSSProperties = {}
    direction === 'down' && (popupStyle.top = offset)
    direction === 'up' && (popupStyle.bottom = offset)
    return popupStyle
  }, [direction, offset])

  const updateOffset = useCallback(() => {
    if (barRef.current) {
      const rect = barRef.current.getBoundingClientRect()
      direction === 'down' && setOffset(rect.bottom)
      direction === 'up' && setOffset(window.innerHeight - rect.top)
    }
  }, [direction])

  const onClickBar = () => {
    setVisible(value => !value)
  }

  const onPopupClose = () => {
    setVisible(false)
    onOpen()
  }

  const onPopupOpen = () => {
    setVisible(true)
    onClose()
  }

  useEffect(() => {
    updateOffset()
  }, [updateOffset])

  useEffect(() => {
    visible ? popupRef.current.open() : popupRef.current.close()
  }, [visible])

  useImperativeHandle(ref, () => ({
    open: () => popupRef.current.open(),
    close: () => popupRef.current.close(),
  }))

  useEventListener(getScroller(barRef.current), 'scroll', updateOffset)

  return (
    <div className={compClsName} style={style}>
      <div className={barClsName} onClick={onClickBar} ref={barRef}>
        <span className={compClsName + '-bar__title'}>{label}</span>
        {showCaret && (
          <Icon type={direction} className={compClsName + '-bar__caret'}></Icon>
        )}
      </div>
      <Popup
        style={popupStyle}
        ref={popupRef}
        position={popupPosition}
        initVisible={initVisible}
        onOpen={onPopupOpen}
        onClose={onPopupClose}
        {...popupProps}
      >
        {props.children}
      </Popup>
    </div>
  )
})

DropDown.defaultProps = defaultProps

export default DropDown
