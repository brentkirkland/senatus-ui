import React, { Component } from 'react'
// import TextArea from 'react-textarea-autosize'
import ContainerHeader from './ContainerHeader'
import './App.css'

class SignProposal extends Component {
  constructor () {
    super()

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    console.log('sumbit')
  }

  render () {
    const { uuid } = this.props
    const { params } = this.props.match
    return (
      <div className='App-window'>
        <ContainerHeader titles={['Proposal', uuid]} />
        <div className='App-container'>
          <label>Hash</label>
          <p>{params[0]}</p>
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
          <input
            onClick={this.handleSubmit}
            type='submit'
            defaultValue='Sign Proposal' />
        </div>
      </div>
    )
  }
}

export default SignProposal
