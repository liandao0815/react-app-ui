import React from 'react'
import Button from '../index'

export default {
  title: 'Button',
}

export const Demo = () => {
  const style = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  }

  return (
    <>
      <div style={style}>
        primary：
        <Button type="primary">按钮一</Button>
      </div>
      <div style={style}>
        optional：<Button type="optional">按钮二</Button>
      </div>
      <div style={style}>
        selected：<Button type="selected">按钮三</Button>
      </div>
      <div style={style}>
        border：
        <Button
          type="border"
          size="large"
          width="44"
          height="44"
          icon="clean"
          circle
          style={{ fontSize: '20px' }}
        ></Button>
      </div>
      <div style={style}>
        large：
        <Button size="large" circle>
          按钮五
        </Button>
      </div>
      <div style={style}>
        disabled：<Button disabled>按钮六</Button>
      </div>
      <div style={style}>
        icon：<Button icon="people">按钮七</Button>
      </div>
    </>
  )
}
