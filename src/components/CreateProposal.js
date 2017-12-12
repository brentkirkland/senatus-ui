import React, { Component } from 'react'
import TextArea from 'react-textarea-autosize'
import Grenache from 'grenache-nodejs-http'
import Link from 'grenache-browser-http'
import ContainerHeader from './ContainerHeader'
import Signature from './Signature'
import './App.css'

class CreateProposal extends Component {
  constructor (props) {
    super(props)

    // const fakeWhitelist = [
    //   {
    //     name: 'Brent',
    //     email: 'brent@bitfinex.com',
    //     address: '0x0123123123123123123122'
    //   },
    //   {
    //     name: 'Fei',
    //     email: 'fei@bitfinex.com',
    //     address: '0x0123104198264123123123'
    //   },
    //   {
    //     name: 'Robert',
    //     email: 'robert@bitfinex.com',
    //     address: '0x0123104192352547346845'
    //   },
    //   {
    //     name: 'Paolo',
    //     email: 'paolo@bitfinex.com',
    //     address: '0x0123104191234234634745'
    //   },
    //   {
    //     name: 'Will',
    //     email: 'will@bitfinex.com',
    //     address: '0x0223102128212354236345'
    //   },
    //   {
    //     name: 'Davide',
    //     email: 'davide@bitfinex.com',
    //     address: '0x0123104198212354236345'
    //   }
    // ]
    const peer = this.getPeer()

    this.state = {
      message: null,
      whitelist: [],
      quorum: null,
      whitelisted: [],
      peer: peer
    }

    this.handleMessage = this.handleMessage.bind(this)
    this.handleWhitelist = this.handleWhitelist.bind(this)
    this.handleQuorum = this.handleQuorum.bind(this)
    this.handleCheckBox = this.handleCheckBox.bind(this)
  }

  componentDidMount () {
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
      this.setState({
        whitelist: data
      })
    })
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
    const { whitelist } = this.state
    const handleCheckBox = this.handleCheckBox
    return whitelist.map((person, index) => {
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
      peer,
      step: 'create'
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
      </div>
    )
  }
}

export default CreateProposal
