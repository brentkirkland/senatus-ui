import React, { Component } from 'react'
import ContainerHeader from './ContainerHeader'
import Signature from './Signature'
import Grenache from 'grenache-nodejs-http'
import Link from 'grenache-browser-http'

import './App.css'

class SignProposal extends Component {
  constructor () {
    super()
    const peer = this.getPeer()
    this.state = {
      peer,
      payload: null
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    this.getData()
  }

  getPeer () {
    const Peer = Grenache.PeerRPCClient
    const link = new Link({
      grape: 'http://127.0.0.1:30001'
    })
    link.start()
    const peer = new Peer(link, {})
    peer.init()
    return peer
  }

  getData () {
    const { peer } = this.state
    const { params } = this.props.match
    const getPayloadQuery = {
      action: 'getPayload',
      'args': [params[0]]
    }
    peer.request('rest:senatus:vanilla', getPayloadQuery, { timeout: 100000 }, (err, data) => {
      if (err) {
        window.alert(err)
      }
      this.setState({
        payload: data
      })
    })
  }

  handleSubmit (e) {
    console.log('sumbit')
  }

  handleSigners (signers) {
    return (
      <div className='App-container-signature'>
        <div className='signature-form'>
          {signers.map((signer, index) => {
            return (
              <label key={'person' + index} className='signature-label-check'>
                <span className='span-name'>{'person.username'}</span>
                <span className='span-email'>{'person.email'}</span>
                <span className='span-address'>{'person.pubkey'}</span>
              </label>
            )
          })}
        </div>
      </div>
    )
  }

  handleSignatures (signatures) {
    return (
      <div className='App-container-signature'>
        <div className='signature-form'>
          {signatures.map((signature, index) => {
            return (
              <label key={'person' + index} className='signature-label-check'>
                <span className='span-name'>{'person.username'}</span>
                <span className='span-email'>{'person.email'}</span>
                <span className='span-address'>{'person.pubkey'}</span>
              </label>
            )
          })}
        </div>
      </div>
    )
  }

  handleSignaturesRequired (sigs, sigsRequired) {
    const amountLeft = sigsRequired - sigs.length
    return <p>{amountLeft + ' more. ' + sigsRequired + ' total. '}</p>
  }

  render () {
    const { uuid } = this.props
    const { params } = this.props.match
    const { payload } = this.state
    const fetching = 'Fetching...'
    const details = (payload) ? JSON.parse(payload.v) : null
    return (
      <div className='App-window'>
        <ContainerHeader titles={['Proposal', uuid]} />
        <div className='App-container'>
          <label>Hash</label>
          <p>{params[0]}</p>
          <label>Message</label>
          <p>{(details) ? details.msg : fetching}</p>
          <label>Whitelist</label>
          {(details) ? this.handleSigners(details.signers) : <p>{fetching}</p>}
          <label>Signatures</label>
          {(details) ? this.handleSignatures(details.sigs) : <p>{fetching}</p>}
          <label>Signatures Required</label>
          {(details) ? this.handleSignaturesRequired(details.sigs, details.sigsRequired) : <p>{fetching}</p>}
          <label>UUID</label>
          <p>{(details) ? details.uuid : fetching}</p>
        </div>
        <Signature />
      </div>
    )
  }
}

export default SignProposal
