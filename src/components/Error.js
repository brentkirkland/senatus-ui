import React, { Component } from 'react'
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

export default Error
