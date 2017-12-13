import React, { Component } from 'react'
import { connect } from 'react-redux'
import ContainerHeader from './ContainerHeader'
import './App.css'

class Error extends Component {
  render () {
    const { error } = this.props
    if (error) {
      return (
        <div>
          <ContainerHeader error />
          <div className='App-container'>
            <label>{error}</label>
          </div>
        </div>
      )
    }
  }
}

function mapStateToProps (state) {
  const { UI = {} } = state
  const error = UI.error || null
  return {
    error
  }
}

export default connect(mapStateToProps)(Error)
