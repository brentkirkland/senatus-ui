import React, { Component } from 'react'
import { connect } from 'react-redux'
import './App.css'

class Greeting extends Component {
  render () {
    const { sigStep, error } = this.props
    if (error) {
      return (
        <div className='App-window-greeting'>
          <div className='App-greeting-red'>
            <p className={'p-mono'}>{error}</p>
          </div>
        </div>
      )
    } else if (sigStep) {
      const greeting = (sigStep === 'created')
        ? 'Proposal successfully created.'
        : 'Proposal successfully signed.'
      return (
        <div className='App-window-greeting'>
          <div className='App-greeting'>
            <p className={'p-mono'}>{greeting}</p>
          </div>
        </div>
      )
    } else {
      return (
        <div className='App-window-greeting'>
          <div className='App-greeting-white' />
        </div>
      )
    }
  }
}

function mapStateToProps (state) {
  const { UI = {} } = state
  const sigStep = UI.post_sig_step || null
  const error = UI.error || null
  return {
    sigStep,
    error
  }
}

export default connect(mapStateToProps)(Greeting)
