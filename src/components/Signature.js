import React, { Component } from 'react'
import Web3 from 'web3'
import sigUtil from 'eth-sig-util'
import ethUtil from 'ethereumjs-util'
// import ledger from 'ledgerco'
import { postSig } from '../middleware/grenache.middleware'
import TextArea from 'react-textarea-autosize'
import ContainerHeader from './ContainerHeader'
import { connect } from 'react-redux'
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
    // TODO: Handle process
    const {
      message,
      signers,
      sigsRequired,
      createError
    } = this.props
    // TODO: move button to redux
    const { button } = this.state
    let error = ''
    if (!message) {
      error = 'Needs a valid message. '
    }
    if (!signers || signers.length === 0) {
      error += 'Needs a valid whitelisted. '
    }
    if (!sigsRequired) {
      error += 'Needs a valid quorum. '
    }
    if (!button) {
      error += 'Needs a signing process. '
    }
    if ((sigsRequired / signers.length) <= 0.5) {
      error += 'A majority will not be reached with such quorum.'
    }
    if (error.length > 0) {
      createError(error)
      // console.log('error', createError)
      // createError(error)
      // this.setState({
      //   signed: false
      // })
    } else if (button === 'ledger') {
      // this.ledgerSign()
    } else {
      this.web3Sign()
    }
  }

  ledgerSign () {
    // ledger.comm_node.create_async().then(function (comm) {
    //   // eslint-disable-next-line new-cap
    //   const eth = new ledger.eth(comm)
    //   console.log('eth', eth)
    //   eth.signPersonalMessage_async("44'/60'/0'/0'/0", Buffer.from('test').toString('hex'))
    //   .then(function (result) {
    //     var v = result['v'] - 27
    //     v = v.toString(16)
    //     if (v.length < 2) {
    //       v = '0' + v
    //     }
    //     console.log('Signature 0x' + result['r'] + result['s'] + v)
    //   })
    //   .catch(function (ex) { console.log(ex) })
    // })
  }

  web3Sign () {
    const { web3 } = this.state
    const {
      message,
      signers,
      sigsRequired,
      uuid,
      sigs,
      createError
    } = this.props
    const data = {
      msg: message,
      signers,
      sigsRequired,
      uuid,
      sigs
    }
    const msg = ethUtil.bufferToHex(Buffer.from(JSON.stringify(data), 'utf8'))
    const signMsg = this.signMsg
    web3.eth.getAccounts(function (err, accounts) {
      if (err) createError('Could not get account')
      if (!accounts) {
        createError('no accounts')
        return
      }
      signMsg(msg, accounts[0])
    })
  }

  signMsg (msg, from) {
    const { createError } = this.props
    const params = [msg, from]
    const method = 'personal_sign'
    const sendPayload = this.sendPayload
    this.state.web3.currentProvider.sendAsync({
      method,
      params,
      from
    }, function (err, result) {
      if (err) return createError('Something went wrong with your web3 provider. Possibly Metamask.')
      if (result.error) {
        return createError(result.error.message)
      }
      const recovered = sigUtil.recoverPersonalSignature({
        data: msg,
        sig: result.result
      })
      if (recovered.toUpperCase() === from.toUpperCase()) {
        sendPayload(result.result, 'metamask', from)
      } else {
        createError('Failed to verify signer, got: ' + result)
      }
    })
  }

  sendPayload (result, method, from) {
    const {
      message,
      signers,
      sigsRequired,
      uuid,
      sigs,
      postSignature,
      whitelistPubkeyMap,
      createError
    } = this.props
    if (whitelistPubkeyMap) {
      const username = whitelistPubkeyMap.get(from).username
      const args = [
        {
          msg: message,
          signers,
          sigsRequired,
          uuid,
          sigs
        },
        {
          signer: username,
          signedMsg: result
        }
      ]
      console.log('posting signature!!!')
      postSignature(args)
    } else {
      createError('Looks like you are not whitelisted.')
    }
  }

  handleRadio (e) {
    const { value } = e.target
    this.setState({
      button: value
    })
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
        </form>
      </div>
    )
  }

  handlePayload () {
    const { payload, hash } = this.props
    if (payload && hash) {
      return (
        <div>
          <ContainerHeader titles={['Payload']} success />
          <div className='App-container'>
            <label>Verified Payload</label>
            <TextArea className='container-textarea'
              spellCheck={false}
              value={JSON.stringify(payload, undefined, 2)} />
            <label>Shareable Hash</label>
            <TextArea className='container-textarea'
              spellCheck={false}
              value={hash} />
          </div>
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
        {this.handlePayload()}
      </div>
    )
  }
}

function mapStateToProps (state) {
  const { UI = {} } = state
  const error = UI.error || null
  const whitelist = UI.whitelist || []
  const message = UI.message_create || null
  const signers = UI.signers_create || []
  const sigsRequired = UI.sigsRequired_create || null
  const whitelistPubkeyMap = UI.whitelistPubkeyMap || null
  const payload = UI.signature_payload || null
  const hash = UI.hash_create || null
  // todo: fix this
  return {
    errorbaby: error,
    whitelist,
    message,
    signers,
    whitelistPubkeyMap,
    payload,
    sigsRequired,
    hash
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
    postSignature: (args) => {
      dispatch(postSig(args))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signature)
