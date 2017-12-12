import React, { Component } from 'react'
import Web3 from 'web3'
import sigUtil from 'eth-sig-util'
import ethUtil from 'ethereumjs-util'
import TextArea from 'react-textarea-autosize'
import ContainerHeader from './ContainerHeader'
import './App.css'

class Signature extends Component {
  constructor (props) {
    super(props)

    this.state = {
      button: null,
      signed: false,
      pubKey: null,
      signedMessage: null,
      error: null
    }

    this.handleRadio = this.handleRadio.bind(this)
    this.web3Sign = this.web3Sign.bind(this)
    this.signMsg = this.signMsg.bind(this)
    this.sendPayload = this.sendPayload.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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

  handleSubmit () {
    const { message, whitelisted, quorum } = this.props.payload
    const { button } = this.state
    let error = ''
    if (!message) {
      error = 'Needs a valid message. '
    }
    if (!whitelisted || whitelisted.length === 0) {
      error += 'Needs a valid whitelisted. '
    }
    if (!quorum) {
      error += 'Needs a valid quorum. '
    }
    if (!button) {
      error += 'Needs a signing process. '
    }
    if ((quorum / whitelisted.length) <= 0.5) {
      error += 'A majority will not be reached with such quorum.'
    }
    if (error.length > 0) {
      this.setState({
        error: error,
        signed: false
      })
    } else {
      this.web3Sign()
    }
  }

  web3Sign () {
    const { web3 } = this.state
    const { message, whitelisted, quorum } = this.props.payload
    const data = {
      msg: message,
      signers: whitelisted,
      sigsRequired: quorum
    }
    const msg = ethUtil.bufferToHex(Buffer.from(JSON.stringify(data), 'utf8'))
    const signMsg = this.signMsg
    web3.eth.getAccounts(function (err, accounts) {
      if (err) console.error('Could not get account')
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
    const sendPayload = this.sendPayload
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
        sendPayload(result.result, 'metamask', from)
      } else {
        window.alert('Failed to verify signer, got: ' + result)
      }
    })
  }

  sendPayload (result, method, from) {
    const {
      message,
      whitelisted,
      quorum,
      peer
    } = this.props.payload
    const username = this.findUser(from)
    const error = (username) ? null : 'You are not whitelisted :('
    this.setState({
      signedMessage: result,
      method: method,
      pubKey: from,
      signed: true,
      error,
      username,
      finalMessage: message,
      finalwhitelisted: whitelisted,
      finalQuorum: quorum
    })
    const args = [
      {
        msg: message,
        signers: whitelisted,
        sigsRequired: quorum
      },
      {
        signer: username,
        signedMsg: result
      }
    ]
    const addSigQuery = {
      action: 'addSig',
      args
    }
    peer.request('rest:senatus:vanilla', addSigQuery, { timeout: 10000 }, (err, res) => {
      if (err) {
        window.alert(err)
      }
      this.setState({
        hash: res
      })
    })
  }

  handleRadio (e) {
    const { value } = e.target
    this.setState({
      button: value
    })
  }

  findUser (pubKey) {
    // TODO: maybe not O(n) lookup
    const { whitelist } = this.props.payload
    for (let i = 0; i < whitelist.length; i++) {
      if (whitelist[i].pubkey.toUpperCase() === pubKey.toString().toUpperCase()) {
        return whitelist[i].username
      }
    }
    return null
  }

  renderRadios () {
    const { button } = this.state
    return (
      <div className='App-container-signature'>
        <form className='signature-form'>
          <label className='signature-label'>
            <input type='radio' value='metamask'
              className='signature-radio'
              checked={(button === 'metamask')}
              onChange={this.handleRadio} /> MetaMask
          </label>
          <label className='signature-label'>
            <input type='radio' value='ledger'
              className='signature-radio'
              checked={(button === 'ledger')}
              onChange={this.handleRadio} /> Ledger Wallet
          </label>
          <label className='signature-label'>
            <input type='radio' value='trezor'
              className='signature-radio'
              checked={(button === 'trezor')}
              onChange={this.handleRadio} /> Trezor
          </label>
        </form>
      </div>
    )
  }

  renderPayload () {
    const { signed } = this.state
    if (signed) {
      const {
        signedMessage,
        finalMessage,
        finalwhitelisted,
        finalQuorum,
        username,
        hash
      } = this.state

      const data = [
        {
          msg: finalMessage,
          signers: finalwhitelisted,
          sigsRequired: finalQuorum
        },
        {
          signer: username, // lookup username
          signedMsg: signedMessage
        }
      ]
      return (
        <div className='App-container'>
          <label>Verified Payload</label>
          <TextArea className='container-textarea'
            spellCheck={false}
            value={JSON.stringify(data, undefined, 2)} />
          <label>Shareable Hash</label>
          {(hash)
            ? (
              <TextArea className='container-textarea'
                spellCheck={false}
                value={hash} />
              )
            : <p>Fetching...</p>}
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

  renderError () {
    const { error } = this.state
    if (error) {
      return (
        <div>
          <ContainerHeader error />
          <div className='App-container'>
            <label>{error}</label>
          </div>
        </div>
      )
    }
  }

  handlePayload () {
    const { signed, error } = this.state
    if (signed && !error) {
      return (
        <div>
          <ContainerHeader titles={['Payload']} success />
          {this.renderPayload()}
        </div>
      )
    }
  }

  render () {
    return (
      <div>
        <ContainerHeader titles={['Sign to Confirm']} />
        <div className='App-container'>
          <label>Signing Process (Only metamask works!)</label>
          {this.renderRadios()}
          <input
            onClick={this.handleSubmit}
            type='submit'
            defaultValue='Sign Proposal' />
        </div>
        {this.renderError()}
        {this.handlePayload()}
      </div>
    )
  }
}

export default Signature
