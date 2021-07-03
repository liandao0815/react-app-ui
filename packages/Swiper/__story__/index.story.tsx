import React, { useRef } from 'react'
import Swiper, { SwiperRef } from '../index'
import Button from '../../Button'

export default {
  title: 'Swiper',
}

export const Demo = () => {
  const swiperRef1 = useRef<SwiperRef>()
  const swiperRef2 = useRef<SwiperRef>()

  const style1 = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#4bc4fc',
    color: 'white',
    fontSize: '36px',
  }

  const style2 = {
    ...style1,
    background: '#777777',
  }

  const style3 = {
    ...style1,
    background: ' #f7d25c',
  }

  return (
    <>
      <div style={{ marginBottom: '16px' }}>
        <span>水平方向：</span>
        <Button
          onClick={() => swiperRef1.current.slidePrev()}
          style={{ marginRight: '12px' }}
        >
          后退
        </Button>
        <Button
          onClick={() => swiperRef1.current.slideNext()}
          style={{ marginRight: '12px' }}
        >
          前进
        </Button>
        <Button
          onClick={() => swiperRef1.current.startPlay()}
          style={{ marginRight: '12px' }}
        >
          播放
        </Button>
        <Button onClick={() => swiperRef1.current.pausePlay()}>暂停</Button>
      </div>
      <Swiper style={{ height: '30vh' }} ref={swiperRef1} loop autoplay>
        <div style={style1}>1</div>
        <div style={style2}>2</div>
        <div style={style3}>3</div>
      </Swiper>

      <div style={{ margin: '16px 0' }}>
        <span>垂直方向：</span>
        <Button
          onClick={() => swiperRef2.current.slidePrev(false)}
          style={{ marginRight: '12px' }}
        >
          后退
        </Button>
        <Button
          onClick={() => swiperRef2.current.slideNext(false)}
          style={{ marginRight: '12px' }}
        >
          前进
        </Button>
        <Button
          onClick={() => swiperRef2.current.startPlay()}
          style={{ marginRight: '12px' }}
        >
          播放
        </Button>
        <Button onClick={() => swiperRef2.current.pausePlay()}>暂停</Button>
      </div>
      <Swiper
        style={{ height: '30vh' }}
        ref={swiperRef2}
        loop={false}
        autoplay
        direction="vertical"
      >
        <div style={style1}>1</div>
        <div style={style2}>2</div>
        <div style={style3}>3</div>
      </Swiper>
    </>
  )
}
