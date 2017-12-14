import React, { Component } from 'react'
import ContainerHeader from './ContainerHeader'
import Signature from './Signature'
import Error from './Error'
import { getWhitelist, getProposal } from '../middleware/grenache.middleware'
import { connect } from 'react-redux'

import './App.css'

class SignProposal extends Component {
  constructor () {
    super()
    this.state = {
      proposal: null,
      params: null
    }
  }

  componentWillMount () {
    const { clearPreviousData } = this.props
    clearPreviousData()
  }

  componentDidMount () {
    const {
      fetchWhitelist,
      fetchProposal
    } = this.props
    fetchWhitelist()
    fetchProposal(this.props.match.params[0])
  }

  componentDidUpdate () {
    const { params } = this.state
    const {
      error,
      fetchWhitelist,
      fetchProposal
    } = this.props
    const currentHash = this.props.match.params[0]
    if (!error && params && params !== currentHash) {
      fetchWhitelist()
      fetchProposal(currentHash)
    }
  }

  handleSigners () {
    const { sigsMap, signers, whitelistUsernameMap } = this.props
    if (whitelistUsernameMap && sigsMap) {
      return (
        <div className='App-container-signature'>
          <div className='signature-form'>
            {signers.map((signer, index) => {
              const user = whitelistUsernameMap.get(signer)
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
    return <p className={'p-mono'}>{'No more signatures required. Concensus was reached.'}</p>
  }

  renderError () {
    const { error } = this.props
    if (error) {
      return <Error />
    }
  }

  renderSignature () {
    const { sigsRequired, sigs } = this.props
    if (sigs && sigs.length < sigsRequired) {
      return <Signature />
    }
  }

  render () {
    const { message, sigsRequired, sigs } = this.props
    const { params } = this.props.match
    const fetching = 'Fetching...'

    return (
      <div className='App-window'>
        <ContainerHeader titles={['Proposal', params[0]]} />
        <div className='App-container'>
          <label>Message</label>
          <p className={'p-mono'}>{(sigs) ? message : fetching}</p>
          <label>Whitelist</label>
          {(sigs) ? this.handleSigners() : <p className={'p-mono'}>{fetching}</p>}
          <label>Signatures Required</label>
          {(sigs) ? this.handleSignaturesRequired(sigs, sigsRequired) : <p className={'p-mono'}>{fetching}</p>}
        </div>
        {this.renderSignature()}
        {this.renderError()}
      </div>
    )
  }
}

function mapStateToProps (state) {
  const { UI = {} } = state
  const error = UI.error || null
  const message = UI.message || null
  const signers = UI.signers || []
  const sigsRequired = UI.sigsRequired || null
  const sigs = UI.sigs || undefined
  const sigsMap = UI.sigsMap || null
  const whitelistUsernameMap = UI.whitelistUsernameMap || null
  return {
    error,
    sigsMap,
    whitelistUsernameMap,
    signers,
    message,
    sigs,
    sigsRequired
  }
}

function mapDispatchToProps (dispatch) {
  return {
    createError: (error = 'Something went wrong.') => {
      const errorOut = {
        type: 'UI_SET',
        payload: {
          section: 'error',
          value: error
        }
      }
      dispatch(errorOut)
    },
    fetchWhitelist: () => {
      dispatch(getWhitelist())
    },
    fetchProposal: (proposal) => {
      dispatch(getProposal(proposal))
    },
    clearPreviousData: () => {
      const clearPayload = {
        type: 'UI_SET',
        payload: {
          section: 'signature_payload',
          value: null
        }
      }
      dispatch(clearPayload)
      const clearHash = {
        type: 'UI_SET',
        payload: {
          section: 'hash_create',
          value: null
        }
      }
      dispatch(clearHash)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignProposal)
