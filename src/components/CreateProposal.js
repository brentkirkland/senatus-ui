import React, { Component } from 'react'
import TextArea from 'react-textarea-autosize'
import '../App.css'

class CreateProposal extends Component {
  render () {
    return (
      <div className='App-container'>
        <h4>Create a proposal that requires group concensus.</h4>
        <label>Message</label>
        <TextArea
          placeholder='Enter message' />
        <label>Whitelist</label>
        <input placeholder='Search to find users' />
        <label>Quorum</label>
        <input placeholder='Signatures Required' />
        <div className='App-body'>
          <input
            value='Create Proposal'
            type='Submit' />
        </div>
        <h2>Steps</h2>
      </div>
    )
  }
}

export default CreateProposal
