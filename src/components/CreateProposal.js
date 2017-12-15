import React, { Component } from 'react'
import TextArea from 'react-textarea-autosize'
import { connect } from 'react-redux'
import ContainerHeader from './ContainerHeader'
import Signature from './Signature'
import { getWhitelist } from '../middleware/grenache.middleware'
import actions from '../actions'
import Error from './Error'
import './App.css'

class CreateProposal extends Component {
  componentWillMount () {
    // not sure how much this will be used...
    // but it's going to hang out for a little
    const { setPage, clearPreviousData, createError } = this.props
    setPage('create')
    clearPreviousData()
    createError(null)
  }

  componentDidMount () {
    const { fetchWhitelist } = this.props
    fetchWhitelist()
  }

  handleCheckBox (e) {
    const { value } = e.target
    const { signers, handleSigners } = this.props
    const index = signers.indexOf(value)
    if (index > -1) {
      signers.splice(index, 1)
    } else {
      signers.push(value)
    }
    handleSigners(signers)
  }

  renderWhitelistButton () {
    const { whitelist } = this.props
    const handleCheckBox = this.handleCheckBox.bind(this)
    const whitelistRows = whitelist.map((person, index) => {
      return (
        <label key={'person' + index} className='signature-label-check'>
          <input type='checkbox' value={person.username}
            className='signature-checked'
            onChange={handleCheckBox} />
          <span className='span-name'>{person.username}</span>
          <span className='span-email'>{person.email}</span>
          <span className='span-address'>{person.pubkey}</span>
        </label>
      )
    })
    if (whitelistRows.length > 0) {
      return whitelistRows
    }
    return <p className={'p-mono'}>Nothing... :(</p>
  }

  renderWhitelist () {
    return (
      <div className='App-container-signature'>
        <form className='signature-form'>
          {this.renderWhitelistButton()}
        </form>
      </div>
    )
  }

  renderError () {
    const { error } = this.props
    if (error) {
      return <Error />
    }
  }

  render () {
    const {
      handleMessage,
      handleSigsRequired
    } = this.props
    return (
      <div className='App-window'>
        <ContainerHeader titles={['Create Proposal']} />
        <div className='App-container'>
          <label>Message</label>
          <TextArea
            onChange={handleMessage}
            className='container-textarea'
            placeholder='Enter message' />
          <label>Whitelist</label>
          {this.renderWhitelist()}
          <label>Quorum</label>
          <input onChange={handleSigsRequired}
            type='number' placeholder='Signatures Required' />
        </div>
        <Signature process={'create'} />
        {this.renderError()}
      </div>
    )
  }
}

function mapStateToProps (state) {
  const { UI = {} } = state
  const error = UI.error || null
  const whitelist = UI.whitelist || []
  const signers = UI.signers || []
  return {
    error,
    whitelist,
    signers
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  const { UI = {} } = actions
  const {
    errorAction,
    setUI,
    clearSection
  } = UI

  return {
    createError: (error = 'Something went wrong.') => {
      const errorOut = errorAction(error)
      dispatch(errorOut)
      dispatch(errorOut)
    },
    fetchWhitelist: () => {
      dispatch(getWhitelist())
    },
    handleMessage: (e) => {
      const { value } = e.target
      const action = setUI('message', value)
      dispatch(action)
    },
    handleSigners: (value) => {
      const action = setUI('signers', value)
      dispatch(action)
    },
    handleSigsRequired: (e) => {
      const { value } = e.target
      const hardValue = parseInt(value, 10)
      const action = setUI('sigsRequired', hardValue)
      dispatch(action)
    },
    setPage: (value) => {
      const action = setUI('page', value)
      dispatch(action)
    },
    clearPreviousData: () => {
      const clearSig = clearSection('signature_payload')
      dispatch(clearSig)
      const clearHash = clearSection('hash_create')
      dispatch(clearHash)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateProposal)
