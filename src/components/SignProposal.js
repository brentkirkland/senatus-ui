import React, { Component } from 'react'
import ContainerHeader from './ContainerHeader'
import Signature from './Signature'
import Error from './Error'
import Grenache from 'grenache-nodejs-http'
import Link from 'grenache-browser-http'
import { connect } from 'react-redux'

import './App.css'

class SignProposal extends Component {
  constructor () {
    super()
    const peer = this.getPeer()
    this.state = {
      peer,
      proposal: null,
      params: null
    }
  }

  componentDidMount () {
    this.getWhitelist()
    this.getData()
  }

  componentDidUpdate () {
    const { params } = this.state
    const { error } = this.props
    if (!error && params && params !== this.props.match.params[0]) {
      this.getWhitelist()
      this.getData()
    }
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
    const { createError } = this.props
    const fxQuery = {
      action: 'getWhitelist',
      args: []
    }
    peer.request('rest:senatus:vanilla', fxQuery, { timeout: 100000 }, (err, data) => {
      if (err) {
        createError('Problem getting whitelist. Make sure your grapes and worker are running.')
      } else {
        const whitelistMap = new Map()
        data.forEach(function (user) {
          whitelistMap.set(user.username, user)
        })
        this.setState({
          whitelist: data,
          whitelistMap
        })
      }
    })
  }

  getData () {
    const { peer } = this.state
    const { createError } = this.props
    const { params } = this.props.match
    const getPayloadQuery = {
      action: 'getPayload',
      'args': [params[0]]
    }
    peer.request('rest:senatus:vanilla', getPayloadQuery, { timeout: 100000 }, (err, data) => {
      if (err) {
        createError('Problem getting proposal. Make sure your grapes and worker are running.')
      } else {
        try {
          const proposal = JSON.parse(data.v)
          const sigsMap = new Map()
          proposal.sigs.forEach(function (sig) {
            sigsMap.set(sig.signer, sig)
          })
          this.setState({
            proposal,
            sigsMap,
            params: params[0]
          })
        } catch (e) {
          this.setState({
            error: 'Looks like that proposal does not exists...'
          })
        }
      }
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

  renderError () {
    const { error } = this.props
    if (error) {
      return <Error />
    }
  }

  render () {
    const { uuid } = this.props
    const { params } = this.props.match
    const { proposal, whitelist, peer, error } = this.state
    let payload = null
    if (proposal) {
      const {
        msg,
        signers,
        sigsRequired,
        sigs,
        error,
        uuid
      } = proposal
      payload = {
        message: msg,
        whitelisted: signers,
        whitelist,
        quorum: sigsRequired,
        uuid,
        sigs,
        peer,
        error
      }
    }
    const fetching = 'Fetching...'
    if (error) {
      // TODO: once redux is in, maybe remove div
      return (
        <div className='App-window'>
          <Error error={error} />
        </div>
      )
    }

    return (
      <div className='App-window'>
        <ContainerHeader titles={['Proposal', uuid]} />
        <div className='App-container'>
          <label>Hash</label>
          <p className={'p-mono'}>{params[0]}</p>
          <label>Message</label>
          <p className={'p-mono'}>{(proposal) ? proposal.msg : fetching}</p>
          <label>Whitelist</label>
          {(proposal) ? this.handleSigners(proposal.signers) : <p className={'p-mono'}>{fetching}</p>}
          <label>Signatures Required</label>
          {(proposal) ? this.handleSignaturesRequired(proposal.sigs, proposal.sigsRequired) : <p className={'p-mono'}>{fetching}</p>}
        </div>
        <Signature payload={payload} />
        {this.renderError()}
      </div>
    )
  }
}

function mapStateToProps (state) {
  const { UI = {} } = state
  const error = UI.error || null
  return {
    error
  }
}

function mapDispatchToProps (dispatch) {
  return {
    createError: (error = 'Something went wrong.') => {
      console.log('creating error')
      const errorOut = {
        type: 'UI_SET',
        payload: {
          section: 'error',
          value: error
        }
      }
      dispatch(errorOut)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignProposal)
