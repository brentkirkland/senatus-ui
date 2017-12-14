import React, { Component } from 'react'
import TextArea from 'react-textarea-autosize'
import { connect } from 'react-redux'
import ContainerHeader from './ContainerHeader'
import Signature from './Signature'
import { getWhitelist } from '../middleware/grenache.middleware'
import Error from './Error'
import './App.css'

class CreateProposal extends Component {
  componentWillMount () {
    // not sure how much this will be used...
    // but it's going to hang out for a little
    const { setPage } = this.props
    setPage('create')
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
  const signers = UI.signers_create || []
  return {
    error,
    whitelist,
    signers
  }
}

function mapDispatchToProps (dispatch, ownProps) {
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
    handleMessage: (e) => {
      const { value } = e.target
      const messageCreate = {
        type: 'UI_SET',
        payload: {
          section: 'message_create',
          value
        }
      }
      dispatch(messageCreate)
    },
    handleSigners: (value) => {
      const sigsCreate = {
        type: 'UI_SET',
        payload: {
          section: 'signers_create',
          value
        }
      }
      dispatch(sigsCreate)
    },
    handleSigsRequired: (e) => {
      const { value } = e.target
      const hardValue = parseInt(value, 10)
      const sigsRequiredCreate = {
        type: 'UI_SET',
        payload: {
          section: 'sigsRequired_create',
          value: hardValue
        }
      }
      dispatch(sigsRequiredCreate)
    },
    setPage: (value) => {
      const pageData = {
        type: 'UI_SET',
        payload: {
          section: 'page',
          value
        }
      }
      dispatch(pageData)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateProposal)
