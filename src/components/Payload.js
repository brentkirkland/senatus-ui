import React, { Component } from 'react'
import { connect } from 'react-redux'
import ContainerHeader from './ContainerHeader'
import TextArea from 'react-textarea-autosize'
import './App.css'

class Payload extends Component {
  render () {
    const { payload, hash, process } = this.props
    let title = 'Signature Submitted'
    if (process && process === 'create') {
      title = 'Proposal Created'
    }
    return (
      <div>
        <ContainerHeader titles={[title]} success />
        <div className='App-container'>
          <label>Verified Payload</label>
          <TextArea className='container-textarea'
            spellCheck={false}
            value={JSON.stringify(payload, undefined, 2)} />
          <label>Shareable Hash</label>
          <TextArea className='container-textarea'
            spellCheck={false}
            value={hash} />
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const { UI = {} } = state
  const payload = UI.signature_payload || null
  const hash = UI.hash_create || null
  return {
    payload,
    hash
  }
}

export default connect(mapStateToProps)(Payload)
