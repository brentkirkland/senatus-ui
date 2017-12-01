import React, { Component } from 'react'
import TextArea from 'react-textarea-autosize'
import ContainerHeader from './ContainerHeader'
import Signature from './Signature'
import './App.css'

class CreateProposal extends Component {
  constructor (props) {
    super(props)

    this.state = {
      message: null,
      whitelist: null,
      quorum: null
    }

    this.handleMessage = this.handleMessage.bind(this)
    this.handleWhitelist = this.handleWhitelist.bind(this)
    this.handleQuorum = this.handleQuorum.bind(this)
  }

  handleMessage (e) {
    const { value } = e.target
    this.setState({
      message: value
    })
  }

  handleWhitelist (e) {
    const { value } = e.target
    this.setState({
      whitelist: value
    })
  }

  handleQuorum (e) {
    const { value } = e.target
    this.setState({
      quorum: parseInt(value, 10)
    })
  }

  render () {
    const { message, whitelist, quorum } = this.state
    const payload = {
      message, whitelist, quorum, step: 'create'
    }
    return (
      <div className='App-window'>
        <ContainerHeader titles={['Create Proposal']} />
        <div className='App-container'>
          <label>Message</label>
          <TextArea
            onChange={this.handleMessage}
            className='container-textarea'
            placeholder='Enter message' />
          <label>Whitelist</label>
          <input onChange={this.handleWhitelist}
            placeholder='Search to find users' />
          <label>Quorum</label>
          <input onChange={this.handleQuorum}
            type='number' placeholder='Signatures Required' />
        </div>
        <Signature payload={payload} />
      </div>
    )
  }
}

export default CreateProposal
