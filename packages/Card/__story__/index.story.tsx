import React from 'react'
import Card from '../index'

export default {
  title: 'Card',
}

export const Demo = () => {
  return (
    <div
      style={{
        backgroundColor: '#fafafa',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      <Card
        tag="启用"
        style={{ marginBottom: '20px' }}
        onClick={() => {
          alert('Click Card!')
        }}
      ></Card>
      <Card tag="禁用" disabled></Card>
    </div>
  )
}
