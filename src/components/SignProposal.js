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
  }

  componentDidMount () {
    this.getData()
    this.getWhitelist()
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

  getWhitelist () {
    const { peer } = this.state
    const fxQuery = {
      action: 'getWhitelist',
      args: []
    }
    peer.request('rest:senatus:vanilla', fxQuery, { timeout: 100000 }, (err, data) => {
      if (err) {
        window.alert(err)
      }
      const whitelistMap = new Map()
      data.forEach(function (user) {
        whitelistMap.set(user.username, user)
      })
      this.setState({
        whitelist: data,
        whitelistMap
      })
    })
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
      const payload = JSON.parse(data.v)
      const sigsMap = new Map()
      payload.sigs.forEach(function (sig) {
        sigsMap.set(sig.signer, sig)
      })
      this.setState({
        payload,
        sigsMap
      })
    })
  }

  handleSigners (signers) {
    const { whitelistMap, sigsMap } = this.state
    if (whitelistMap && sigsMap) {
      return (
        <div className='App-container-signature'>
          <div className='signature-form'>
            {signers.map((signer, index) => {
              const user = whitelistMap.get(signer)
              const signed = sigsMap.has(user.username)
              if (signed) {
                return (
                  <label key={'person' + index} className='signature-label-check'>
                    <span className='span-name'><b>{user.username}</b></span>
                    <span className='span-email'><b>{user.email}</b></span>
                    <span className='span-address'><b>{user.pubkey}</b></span>
                  </label>
                )
              }
              return (
                <label key={'person' + index} className='signature-label-check'>
                  <span className='span-name'>{user.username}</span>
                  <span className='span-email'>{user.email}</span>
                  <span className='span-address'>{user.pubkey}</span>
                </label>
              )
            })}
          </div>
        </div>
      )
    }
  }

  handleSignaturesRequired (sigs, sigsRequired) {
    const amountLeft = sigsRequired - sigs.length
    if (amountLeft > 0) {
      return <p className={'p-mono'}>{amountLeft + ' more. ' + sigsRequired + ' total. '}</p>
    }
    return <p className={'p-mono'}>{'None. Process Complete.'}</p>
  }

  render () {
    const { uuid } = this.props
    const { params } = this.props.match
    const { payload } = this.state
    const fetching = 'Fetching...'
    return (
      <div className='App-window'>
        <ContainerHeader titles={['Proposal', uuid]} />
        <div className='App-container'>
          <label>Hash</label>
          <p className={'p-mono'}>{params[0]}</p>
          <label>Message</label>
          <p className={'p-mono'}>{(payload) ? payload.msg : fetching}</p>
          <label>Whitelist</label>
          {(payload) ? this.handleSigners(payload.signers) : <p>{fetching}</p>}
          <label>Signatures Required</label>
          {(payload) ? this.handleSignaturesRequired(payload.sigs, payload.sigsRequired) : <p>{fetching}</p>}
        </div>
        <Signature />
      </div>
    )
  }
}

export default SignProposal
