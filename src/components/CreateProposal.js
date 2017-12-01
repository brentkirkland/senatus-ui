import React, { Component } from 'react'
import Web3 from 'web3'
import sigUtil from 'eth-sig-util'
import ethUtil from 'ethereumjs-util'
import TextArea from 'react-textarea-autosize'
import ContainerHeader from './ContainerHeader'
import Signature from './Signature'
import './App.css'

class CreateProposal extends Component {
  constructor (props) {
    super(props)

    this.state = {
      signed: false,
      message: '',
      whitelist: '',
      pubKey: '',
      signedMessage: '',
      quorum: 12
    }

    this.handleMessage = this.handleMessage.bind(this)
    this.handleWhitelist = this.handleWhitelist.bind(this)
    this.handleQuorum = this.handleQuorum.bind(this)
    this.web3Sign = this.web3Sign.bind(this)
    this.signMsg = this.signMsg.bind(this)
    this.setSignedMessage = this.setSignedMessage.bind(this)
  }

  componentDidMount () {
    this.initWeb3()
  }

  initWeb3 () {
    let web3
    if (typeof window.web3 !== 'undefined') {
      web3 = new Web3(window.web3.currentProvider)
    } else {
      // set the provider you want from Web3.providers
      web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    }
    this.setState({web3: web3})
  }

  web3Sign () {
    const { message, whitelist, quorum, web3 } = this.state
    const data = {
      message,
      whitelist,
      quorum
    }
    const msg = ethUtil.bufferToHex(Buffer.from(JSON.stringify(data), 'utf8'))
    const signMsg = this.signMsg
    web3.eth.getAccounts(function (err, accounts) {
      if (err) console.error('Uh oh')
      if (!accounts) {
        console.error('no accounts')
        return
      }
      signMsg(msg, accounts[0])
    })
  }

  signMsg (msg, from) {
    const params = [msg, from]
    const method = 'personal_sign'
    const setSignedMessage = this.setSignedMessage
    this.state.web3.currentProvider.sendAsync({
      method,
      params,
      from
    }, function (err, result) {
      if (err) return console.error(err)
      if (result.error) {
        return console.error(result.error.message)
      }
      const recovered = sigUtil.recoverPersonalSignature({
        data: msg,
        sig: result.result
      })
      if (recovered.toUpperCase() === from.toUpperCase()) {
        setSignedMessage(result.result, 'metamask', from)
      } else {
        window.alert('Failed to verify signer, got: ' + result)
      }
    })
  }

  setSignedMessage (result, method, from) {
    this.setState({
      signedMessage: result,
      method: method,
      pubKey: from,
      signed: true
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

  renderPayload () {
    const { signed } = this.state
    if (signed) {
      const { message, whitelist, quorum, signedMessage, pubKey } = this.state
      const data = {
        message,
        whitelist,
        quorum,
        signedMessage,
        pubKey,
        timestamp: Date.now(),
        uuid: 1
      }
      return (
        <div className='App-container'>
          <label>Verified Payload</label>
          <TextArea className='container-textarea'
            value={JSON.stringify(data, undefined, 2)} />
        </div>
      )
    }
    return (
      <div className='App-container'>
        <label>Payload</label>
        <p>Complete proposal and sign to view payload.</p>
      </div>
    )
  }

  complete (value) {
    console.log('Clicked!')
    // at the time only assume metamask
  }

  render () {
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
          <input onChange={this.handleWhitelist}
            placeholder='Search to find users' />
          <label>Quorum</label>
          <input onChange={this.handleQuorum}
            type='number' placeholder='Signatures Required' />
        </div>
        <ContainerHeader titles={['Sign to Confirm']} />
        <div className='App-container'>
          <label>Signing Process (Only metamask works!)</label>
          <Signature complete={this.complete} />
          <input
            onClick={this.web3Sign}
            type='submit'
            defaultValue='Sign Proposal' />
        </div>
        <ContainerHeader titles={['Payload (testing purposes)']} />
        {this.renderPayload()}
      </div>
    )
  }
}

export default CreateProposal
