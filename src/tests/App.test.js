import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const it = window.it

it('renders without crashing, what a lame test', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
})
