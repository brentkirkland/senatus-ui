import React, { Component } from 'react'
import TextArea from 'react-textarea-autosize'
import ContainerHeader from './ContainerHeader'
import Signature from './Signature'
import './App.css'

class CreateProposal extends Component {
  constructor (props) {
    super(props)

    const fakeWhitelist = [
      {
        name: 'Brent',
        email: 'brent@bitfinex.com',
        address: '0x0123123123123123123122'
      },
      {
        name: 'Fei',
        email: 'fei@bitfinex.com',
        address: '0x0123104198264123123123'
      },
      {
        name: 'Robert',
        email: 'robert@bitfinex.com',
        address: '0x0123104192352547346845'
      },
      {
        name: 'Paolo',
        email: 'paolo@bitfinex.com',
        address: '0x0123104191234234634745'
      },
      {
        name: 'Will',
        email: 'will@bitfinex.com',
        address: '0x0223102128212354236345'
      },
      {
        name: 'Davide',
        email: 'davide@bitfinex.com',
        address: '0x0123104198212354236345'
      }
    ]

    this.state = {
      message: null,
      whitelist: [],
      quorum: null,
      whitelisted: fakeWhitelist
    }

    this.handleMessage = this.handleMessage.bind(this)
    this.handleWhitelist = this.handleWhitelist.bind(this)
    this.handleQuorum = this.handleQuorum.bind(this)
    this.handleCheckBox = this.handleCheckBox.bind(this)
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
    const { whitelist } = this.state
    const index = whitelist.indexOf(value)
    if (index > -1) {
      whitelist.splice(index, 1)
    } else {
      whitelist.push(value)
    }
    this.setState({
      whitelist: whitelist
    })
  }

  renderWhitelistButton () {
    const { whitelisted } = this.state
    const handleCheckBox = this.handleCheckBox
    return whitelisted.map((person, index) => {
      return (
        <label key={'person' + index} className='signature-label-check'>
          <input type='checkbox' value={person.address}
            className='signature-checked'
            onChange={handleCheckBox} />
          <span className='span-name'>{person.name}</span>
          <span className='span-email'>{person.email}</span>
          <span className='span-address'>{person.address}</span>
        </label>
      )
    })
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

  render () {
    const { message, whitelist, quorum } = this.state
    const payload = {
      message, whitelist, quorum, step: 'create'
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
          {/* <input onChange={this.handleWhitelist}
            placeholder='Search to find users' /> */}
          <label>Quorum</label>
          <input onChange={this.handleQuorum}
            type='number' placeholder='Signatures Required' />
        </div>
        <Signature payload={payload} />
      </div>
    )
  }
}

export default CreateProposal
