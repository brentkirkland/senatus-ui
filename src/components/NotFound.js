import React, { Component } from 'react'
// import TextArea from 'react-textarea-autosize'
import '../App.css'

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
        <p>Seems like an unkown issue happened...</p>
      </div>
    )
  }
}

export default NotFound
