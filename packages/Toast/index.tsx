import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { guuid, noop } from '../utils'
import './index.less'

export type NoticeProps = {
  content: React.ReactNode
  duration?: number
  key?: string
  onClose?(): void
}

type NotificationState = {
  notices: NoticeProps[]
}

class Notification extends Component<{}, NotificationState> {
  compClsPrefix = 'react-app-ui-toast'
  transitionDuration = 300
  maxNotice = 5

  state: NotificationState = {
    notices: [],
  }

  addNotice(notice: NoticeProps) {
    const { notices } = this.state
    notice.key = guuid()
    if (notices.every(item => item.key !== notice.key)) {
      if (notices.length >= this.maxNotice) {
        this.removeNotice(notices[0].key)
      }
      this.setState(state => ({
        notices: [...state.notices, notice],
      }))
    }
    if (notice.duration > 0) {
      setTimeout(() => {
        this.removeNotice(notice.key)
      }, notice.duration)
    }
    return () => {
      this.removeNotice(notice.key)
    }
  }

  removeNotice(key: string) {
    this.setState((state: NotificationState) => ({
      notices: state.notices.filter(notice => {
        if (notice.key === key) {
          notice.onClose && setTimeout(notice.onClose, this.transitionDuration)
          return false
        }
        return true
      }),
    }))
  }

  render() {
    const notices = this.state.notices
    return (
      <TransitionGroup className={this.compClsPrefix}>
        {notices.map(notice => (
          <CSSTransition
            appear
            key={notice.key}
            classNames="react-app-ui-transition--fade"
            timeout={this.transitionDuration}
          >
            <span className={this.compClsPrefix + '-content'}>
              {notice.content}
            </span>
          </CSSTransition>
        ))}
      </TransitionGroup>
    )
  }
}

function createNotification() {
  const container = document.createElement('div')
  document.body.appendChild(container)

  const ref = React.createRef<Notification>()
  ReactDOM.render(<Notification ref={ref} />, container)

  return {
    addNotice(notice: NoticeProps) {
      return ref.current?.addNotice(notice)
    },
    destroy() {
      ReactDOM.unmountComponentAtNode(container)
      document.body.removeChild(container)
    },
  }
}

let notification: ReturnType<typeof createNotification> = null

const noticeFn = (args: Omit<NoticeProps, 'key'>) => {
  if (!notification) notification = createNotification()
  return notification.addNotice(args)
}

export default {
  info(content: React.ReactNode, duration = 3000, onClose = noop) {
    return noticeFn({ content, duration, onClose })
  },
}
