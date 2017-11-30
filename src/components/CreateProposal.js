import React, { Component } from 'react'
import TextArea from 'react-textarea-autosize'
import ContainerHeader from './ContainerHeader'
import '../App.css'

class CreateProposal extends Component {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleMessage = this.handleMessage.bind(this)
    this.handleWhitelist = this.handleWhitelist.bind(this)
    this.handleQuorum = this.handleQuorum.bind(this)
  }

  handleSubmit (e) {
    console.log('sumbit')
  }

  handleMessage (e) {
    console.log('message')
  }

  handleWhitelist (e) {
    console.log('whitelist')
  }

  handleQuorum (e) {
    console.log('quorum')
  }

  render () {
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
          <label>Signature</label>
          <p>SIGNATURE COMPONENT</p>
          <input
            onClick={this.handleSubmit}
            defaultValue='Create Proposal'
            type='Submit' />
        </div>
      </div>
    )
  }
}

export default CreateProposal
