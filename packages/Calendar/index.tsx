import React, { useRef, useState } from 'react'
import classnames from 'classnames'
import dayjs from 'dayjs'
import Swiper, { SwiperRef } from '../Swiper'
import './index.less'

import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(customParseFormat)
dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

export type CalendarProps = Readonly<
  {
    value: string
    minDate?: string
    maxDate?: string
    onChange: (value: string) => void
    className?: string
    style?: React.CSSProperties
  } & Partial<typeof defaultProps>
>

const defaultProps = {
  showHeader: true,
  showIndicator: true,
  format: 'YYYY-MM-DD',
}

/**
 * 获取该月份日期以及前后两月份填充日期
 */
function getDateList(dayjsObj: dayjs.Dayjs): number[][] {
  const startDay = dayjsObj.date(1).day()
  const daysInCurMonth = dayjsObj.daysInMonth()
  const daysInPrevMonth = dayjsObj.date(0).daysInMonth()

  const prevMonthLen = startDay + 7 >= 10 ? startDay : startDay + 7
  const nextMonthLen = 42 - prevMonthLen - daysInCurMonth

  const prevMonthDateArray = []
  const curMonthDateArray = []
  const nextMonthDateArray = []

  for (let i = daysInPrevMonth - prevMonthLen + 1; i <= daysInPrevMonth; i++) {
    prevMonthDateArray.push(i)
  }
  for (let j = 1; j <= daysInCurMonth; j++) {
    curMonthDateArray.push(j)
  }
  for (let k = 1; k <= nextMonthLen; k++) {
    nextMonthDateArray.push(k)
  }

  return [prevMonthDateArray, curMonthDateArray, nextMonthDateArray]
}

/**
 * 获取该月份以及前后两月份日期表
 */
function getAroundDateList(
  date: dayjs.ConfigType,
): Record<'prev' | 'cur' | 'next', number[][]> {
  const curDate = dayjs(date)
  const prevDate = curDate.subtract(1, 'M')
  const nextDate = curDate.add(1, 'M')

  return {
    prev: getDateList(prevDate),
    cur: getDateList(curDate),
    next: getDateList(nextDate),
  }
}

const Calendar: React.FC<CalendarProps> = props => {
  const {
    value,
    format,
    minDate,
    maxDate,
    showIndicator,
    showHeader,
    onChange,
    className,
    style,
  } = props

  const swiperRef = useRef<SwiperRef>(null)
  const [curPanelDate, setCurPanelDate] = useState(dayjs(value, format))
  const [dateList, setDateList] = useState(() => {
    const { prev, cur, next } = getAroundDateList(curPanelDate)
    return [
      { matrix: prev, date: curPanelDate.subtract(1, 'M') },
      { matrix: cur, date: curPanelDate },
      { matrix: next, date: curPanelDate.add(1, 'M') },
    ]
  })

  const weekList = ['日', '一', '二', '三', '四', '五', '六']

  const compClsPrefix = 'react-app-ui-calendar'
  const compClsName = classnames(compClsPrefix, className)

  const checkOptional = (target: number, date: dayjs.Dayjs) => {
    const curDate = date.date(target)

    if (minDate && maxDate) {
      return dayjs(curDate).isBetween(minDate, maxDate, 'date', '[]')
    }
    if (minDate) {
      return dayjs(curDate).isSameOrAfter(minDate, 'date')
    }
    if (maxDate) {
      return dayjs(curDate).isSameOrBefore(maxDate, 'date')
    }
    return false
  }

  const getPanelDateItemCls = (
    target: number,
    date: dayjs.Dayjs,
    optional = false,
  ) => {
    const isSelected = dayjs(value).isSame(date.date(target), 'date')
    const commonCls = {
      [`${compClsPrefix}__panel-ul-item`]: true,
      [`${compClsPrefix}__panel-ul-item--selected`]: isSelected,
    }

    if (optional && checkOptional(target, date)) {
      return classnames({
        ...commonCls,
        [`${compClsPrefix}__panel-ul-item--choosed`]: !isSelected,
      })
    } else {
      return classnames(`${compClsPrefix}__panel-ul-item--disabled`, commonCls)
    }
  }

  const getDateChar = (target: number, date: dayjs.Dayjs) => {
    const isToday = dayjs(new Date()).isSame(date.date(target), 'date')
    return isToday ? '今' : target
  }

  const renderPanelList = (
    data: number[][],
    index: number,
    date: dayjs.Dayjs,
  ) => {
    return (
      <ul className={compClsPrefix + '__panel-ul'} key={index}>
        {data[0].map(item => (
          <li
            key={'prev' + item}
            className={getPanelDateItemCls(item, date.subtract(1, 'M'))}
            onClick={() => swiperRef.current.slidePrev()}
          >
            {getDateChar(item, date.subtract(1, 'M'))}
          </li>
        ))}
        {data[1].map(item => (
          <li
            key={'cur' + item}
            className={getPanelDateItemCls(item, date, true)}
            onClick={() => onPanelItemClick(item)}
          >
            {getDateChar(item, date)}
          </li>
        ))}
        {data[2].map(item => (
          <li
            key={'next' + item}
            className={getPanelDateItemCls(item, date.add(1, 'M'))}
            onClick={() => swiperRef.current.slideNext()}
          >
            {getDateChar(item, date.add(1, 'M'))}
          </li>
        ))}
      </ul>
    )
  }

  const onPanelItemClick = (date: number) => {
    if (checkOptional(date, curPanelDate)) {
      onChange(curPanelDate.date(date).format(format))
    }
  }

  const onSwiped = (index: number, dir: number) => {
    let _curPanelDate: dayjs.Dayjs

    if (dir > 0) {
      _curPanelDate = curPanelDate.add(1, 'M')
    }
    if (dir < 0) {
      _curPanelDate = curPanelDate.subtract(1, 'M')
    }

    setCurPanelDate(_curPanelDate)

    const { prev, cur, next } = getAroundDateList(_curPanelDate)
    const _dateList = [
      { matrix: prev, date: _curPanelDate.subtract(1, 'M') },
      { matrix: cur, date: _curPanelDate },
      { matrix: next, date: _curPanelDate.add(1, 'M') },
    ]

    switch (index) {
      case 0:
        setDateList([_dateList[1], _dateList[2], _dateList[0]])
        break
      case 1:
        setDateList(_dateList)
        break
      case 2:
        setDateList([_dateList[2], _dateList[0], _dateList[1]])
        break
    }
  }

  return (
    <div className={compClsName} style={style}>
      {showHeader && (
        <div className={compClsPrefix + '__header'}>
          {showIndicator && (
            <span
              className={compClsPrefix + '__header--prev'}
              onClick={() => swiperRef.current.slidePrev()}
            >
              &lt;
            </span>
          )}
          <span className={compClsPrefix + '__header--text'}>
            {dayjs(curPanelDate).format('YYYY年MM月')}
          </span>
          {showIndicator && (
            <span
              className={compClsPrefix + '__header--prev'}
              onClick={() => swiperRef.current.slideNext()}
            >
              &gt;
            </span>
          )}
        </div>
      )}
      <ul className={compClsPrefix + '__week'}>
        {weekList.map((item, index) => (
          <li key={'week' + index} className={compClsPrefix + '__week-item'}>
            {item}
          </li>
        ))}
      </ul>
      <Swiper
        className={compClsPrefix + '__panel'}
        ref={swiperRef}
        defaultIndex={1}
        onSwiped={onSwiped}
      >
        {dateList.map((item, index) => (
          <div className={compClsPrefix + '__panel-box'} key={index}>
            <div
              className={compClsPrefix + '__panel-background'}
              data-text={item.date.month() + 1}
            ></div>
            {renderPanelList(item.matrix, index, item.date)}
          </div>
        ))}
      </Swiper>
    </div>
  )
}

Calendar.defaultProps = defaultProps

export default Calendar
