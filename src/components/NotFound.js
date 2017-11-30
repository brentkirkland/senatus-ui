import React, { Component } from 'react'
import './App.css'

class NotFound extends Component {
  renderBadUrl () {
    return (
      <div className='App-container'>
        <p>No such route to specified URL</p>
      </div>
    )
  }

  render () {
    const { type } = this.props
    console.log('type', type)
    if (type === 'url') {
      return this.renderBadUrl()
    }
    return (
      <div className='App-container'>
        <h1>Crap. That didn't work.</h1>
      </div>
    )
  }
}

export default NotFound
