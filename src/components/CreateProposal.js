import React, { Component } from 'react'
import TextArea from 'react-textarea-autosize'
import { connect } from 'react-redux'
import ContainerHeader from './ContainerHeader'
import Signature from './Signature'
import { getWhitelist } from '../middleware/grenache.middleware'
import Error from './Error'
import './App.css'

class CreateProposal extends Component {
  constructor (props) {
    super(props)

    this.state = {
      message: null,
      quorum: null,
      whitelisted: []
    }

    this.handleMessage = this.handleMessage.bind(this)
    this.handleWhitelist = this.handleWhitelist.bind(this)
    this.handleQuorum = this.handleQuorum.bind(this)
    this.handleCheckBox = this.handleCheckBox.bind(this)
  }

  componentDidMount () {
    const { fetchWhitelist } = this.props
    fetchWhitelist()
  }

  handleMessage (e) {
    const { value } = e.target
    this.setState({
      message: value
    })
  }

  handleWhitelist (e) {
    const { value } = e.target
    this.setState({
      whitelist: value
    })
  }

  handleQuorum (e) {
    const { value } = e.target
    this.setState({
      quorum: parseInt(value, 10)
    })
  }

  handleCheckBox (e) {
    const { value } = e.target
    const { whitelisted } = this.state
    const index = whitelisted.indexOf(value)
    if (index > -1) {
      whitelisted.splice(index, 1)
    } else {
      whitelisted.push(value)
    }
    this.setState({
      whitelisted
    })
  }

  renderWhitelistButton () {
    const { whitelist } = this.props
    const handleCheckBox = this.handleCheckBox
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
      message,
      quorum,
      whitelisted,
      whitelist,
      peer
     } = this.state
    const payload = {
      message,
      whitelisted,
      whitelist,
      quorum,
      peer
    }
    return (
      <div className='App-window'>
        <ContainerHeader titles={['Create Proposal']} />
        <div className='App-container'>
          <label>Message</label>
          <TextArea
            onChange={this.handleMessage}
            className='container-textarea'
            placeholder='Enter message' />
          <label>Whitelist</label>
          {this.renderWhitelist()}
          <label>Quorum</label>
          <input onChange={this.handleQuorum}
            type='number' placeholder='Signatures Required' />
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
  const whitelist = UI.whitelist || []
  return {
    error,
    whitelist
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateProposal)
