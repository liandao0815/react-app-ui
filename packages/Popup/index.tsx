import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import classnames from 'classnames'
import { CSSTransition } from 'react-transition-group'
import { usePortal, useClickOutside } from '../hooks'
import { noop } from '../utils'
import './index.less'

export type PopupPosition = 'top' | 'right' | 'bottom' | 'left' | 'center'

export type PopupProps = Readonly<
  {
    container?: HTMLElement
    children?: React.ReactNode
    className?: string
    style?: React.CSSProperties
  } & Partial<typeof defaultProps>
>

export type PopupRef = Readonly<{
  open: () => void
  close: () => void
}>

const defaultProps = {
  initVisible: false,
  position: 'center' as PopupPosition,
  mask: true,
  round: true,
  lockScroll: true,
  closeOnMask: true,
  closeOnDistory: false,
  onOpen: noop,
  onOpened: noop,
  onClose: noop,
  onClosed: noop,
}

const transitionDuration = 300
const transitionClsPrefix = 'react-app-ui-transition'
const transitionNames: Record<PopupPosition, string> = {
  top: `${transitionClsPrefix}--slide-down`,
  right: `${transitionClsPrefix}--slide-left`,
  bottom: `${transitionClsPrefix}--slide-up`,
  left: `${transitionClsPrefix}--slide-right`,
  center: `${transitionClsPrefix}--fade`,
}

const Popup = React.forwardRef<PopupRef, PopupProps>((props, ref) => {
  const {
    container,
    initVisible,
    position,
    mask,
    round,
    lockScroll,
    closeOnDistory,
    closeOnMask,
  } = props

  const contentRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(initVisible)
  const [animating, setAnimating] = useState(false)

  const compClsPrefix = 'react-app-ui-popup'
  const compClsName = classnames(props.className, compClsPrefix, {
    [`${compClsPrefix}__visible`]: visible || animating,
  })
  const contentCls = classnames(
    `${compClsPrefix}-content`,
    `${compClsPrefix}-content__${position}`,
    {
      [`${compClsPrefix}-content__${position}--round`]: round,
    },
  )
  const maskCls = classnames(`${compClsPrefix}-mask`, 'react-app-ui-mask')

  const onEnter = () => {
    setAnimating(true)
    props.onOpen()
  }

  const onEntered = () => {
    setAnimating(false)
    props.onOpened()
  }

  const onExit = () => {
    setAnimating(true)
    props.onClose()
  }

  const onExited = () => {
    setAnimating(false)
    props.onClosed()
  }

  const popupNode = (
    <div className={compClsName} style={props.style}>
      {mask && (
        <CSSTransition
          appear
          in={visible}
          timeout={transitionDuration}
          classNames="react-app-ui-transition--fade"
          unmountOnExit
        >
          <div className={maskCls}></div>
        </CSSTransition>
      )}
      <CSSTransition
        appear
        in={visible}
        timeout={transitionDuration}
        classNames={transitionNames[position]}
        unmountOnExit={closeOnDistory}
        onEnter={onEnter}
        onEntered={onEntered}
        onExit={onExit}
        onExited={onExited}
      >
        <div className={contentCls} ref={contentRef}>
          {props.children}
        </div>
      </CSSTransition>
    </div>
  )

  useEffect(() => {
    if (visible && lockScroll) {
      document.body.classList.add(`${compClsPrefix}-overflow-hidden`)
    } else {
      document.body.classList.remove(`${compClsPrefix}-overflow-hidden`)
    }
  }, [visible, lockScroll])

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
    close: () => setVisible(false),
  }))

  useClickOutside(contentRef, () => {
    closeOnMask && setVisible(false)
  })

  return usePortal(popupNode, container)
})

Popup.defaultProps = defaultProps

export default Popup
