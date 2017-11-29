import React, { Component } from 'react'
import TextArea from 'react-textarea-autosize'
import '../App.css'

class CreateProposal extends Component {
  render () {
    return (
      <div className='App-container'>
        <label>Message</label>
        <TextArea
          className='container-textarea'
          placeholder='Enter message' />
        <label>Whitelist</label>
        <input placeholder='Search to find users' />
        <label>Quorum</label>
        <input type='number' placeholder='Signatures Required' />
        <label>Signature</label>
        <p>SIGNATURE COMPONENT</p>
        <input
          value='Create Proposal'
          type='Submit' />
      </div>
    )
  }
}

export default CreateProposal
