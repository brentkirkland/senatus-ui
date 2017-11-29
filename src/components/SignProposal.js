import React, { Component } from 'react'
// import TextArea from 'react-textarea-autosize'
import '../App.css'

class SignProposal extends Component {
  render () {
    return (
      <div className='App-container'>
        <h4>Hash 1231a</h4>
        <label>Message</label>
        <p>This is the message I want you to see. \ nThis is the message I want you to see. This is the message I want you to see. This is the message I want you to see. This is the message I want you to see</p>
        <label>Whitelist</label>
        <p>Brent, Paolo, Yaya</p>
        <label>Quorum</label>
        <p>2 out of 3 sigs</p>
        <label>Timestamp</label>
        <p>Some date</p>
        <label>Signature</label>
        <p>SIGNATURE COMPONENT</p>
        <br />
        <input type='submit' value='Sign Proposal' />
      </div>
    )
  }
}

export default SignProposal
