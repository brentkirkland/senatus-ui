import React, { Component } from 'react'
import Web3 from 'web3'
import sigUtil from 'eth-sig-util'
import './App.css'

class App extends Component {
  constructor () {
    super()

    this.state = {
      web3: null,
      message: '',
      signedMessage: 'No message yet'
    }
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
    console.log('i like to fire')
    console.log('message', this.state.message)
    const msgParams = [
      {
        type: 'string',      // Any valid solidity type
        name: 'Message',     // Any string label you want
        value: this.state.message  // The value to sign
      }
    ]
    // Get the current account:
    const signMsg = this.signMsg.bind(this)
    this.state.web3.eth.getAccounts(function (err, accounts) {
      console.log('i like to get accounts')
      if (err) console.error('Uh oh')
      if (!accounts) return
      signMsg(msgParams, accounts[0])
    })
  }

  signMsg (msgParams, from) {
    const setSignedMessage = this.setSignedMessage.bind(this)
    this.state.web3.currentProvider.sendAsync({
      method: 'eth_signTypedData',
      params: [msgParams, from],
      from: from
    }, function (err, result) {
      if (err) return console.error(err)
      if (result.error) {
        return console.error(result.error.message)
      }
      const recovered = sigUtil.recoverTypedSignature({
        data: msgParams,
        sig: result.result
      })
      console.log(from, recovered, 'motherfucker')
      if (recovered.toUpperCase() === from.toUpperCase()) {
        // window.alert('Recovered signer: ' + from)
        setSignedMessage(result.result)
      } else {
        window.alert('Failed to verify signer, got: ' + result)
      }
    })
  }

  setSignedMessage (result) {
    this.setState({
      'signedMessage': result
    })
  }

  handleTextAreaChange (e) {
    this.setState({
      message: e.target.value
    })
  }

  render () {
    console.log(this.state)
    console.log(window.web3.currentProvider)
    return (
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>Senatus</h1>
        </header>
        <div className='App-body'>
          <p className='App-intro'>
            Welcome to the beginning of Senatus.
          </p>
          <h3>TODO</h3>
          <ul>
            <li>Setup Redux Sagas</li>
            <li>Setup app structure</li>
            <li>Get Whitelist</li>
            <li>Get list</li>
            <li>Get sign</li>
            <li>Get validate</li>
          </ul>
        </div>
        <div className='App-body'>
          <h4>Enter a message:</h4>
          <textarea
            onChange={this.handleTextAreaChange.bind(this)}
            value={this.state.message}
            playholder='Enter a unique message here' />
        </div>
        <div className='App-body'>
          <h4>Pick your poison:</h4>
          <label className='radio'
            onClick={this.web3Sign.bind(this)}>
            <input type='radio' value='metamask' />
            <span>Metamask</span>
          </label>
          <label className='radio'>
            <input type='radio' value='ledger' />
            <span>Ledger Wallet</span>
          </label>
          <label className='radio'>
            <input type='radio' value='trezor' />
            <span>Trezor</span>
          </label>
        </div>
        <div className='App-body'>
          <h4>Your Signed Message:</h4>
          <span>{this.state.signedMessage}</span>
        </div>
        <div className='App-body'>
          <h1>This is an h1 header</h1>
          <h2>This is an h2 header</h2>
          <h3>This is an h3 header</h3>
          <h4>This is an h4 header</h4>
          <span>This is a span</span>
          <p>This is a paragraph</p>
        </div>
      </div>
    )
  }
}

export default App
