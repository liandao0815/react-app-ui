import React, { useRef } from 'react'
import Popup, { PopupRef } from '../index'
import Button from '../../Button'

export default {
  title: 'Popup',
}

export const Demo = () => {
  const popupRef1 = useRef<PopupRef>(null)
  const popupRef2 = useRef<PopupRef>(null)
  const popupRef3 = useRef<PopupRef>(null)
  const popupRef4 = useRef<PopupRef>(null)
  const popupRef5 = useRef<PopupRef>(null)

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button onClick={() => popupRef1.current.open()}>bottom</Button>
        <Button onClick={() => popupRef2.current.open()}>top</Button>
        <Button onClick={() => popupRef3.current.open()}>right</Button>
        <Button onClick={() => popupRef4.current.open()}>left</Button>
        <Button onClick={() => popupRef5.current.open()}>center</Button>
      </div>
      <Popup ref={popupRef1} position="bottom">
        <div style={{ height: '40vh', padding: '16px' }}>Popup</div>
      </Popup>
      <Popup ref={popupRef2} position="top">
        <div style={{ height: '40vh', padding: '16px' }}>Popup</div>
      </Popup>
      <Popup ref={popupRef3} position="right" round={false}>
        <div style={{ width: '50vw', padding: '16px' }}>Popup</div>
      </Popup>
      <Popup ref={popupRef4} position="left" round={false}>
        <div style={{ width: '50vw', padding: '16px' }}>Popup</div>
      </Popup>
      <Popup ref={popupRef5} position="center">
        <div style={{ height: '40vh', width: '40vh', padding: '16px' }}>
          Popup
        </div>
      </Popup>
    </>
  )
}
