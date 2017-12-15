import React, { Component } from 'react'
import Web3 from 'web3'
// import ledger from 'ledgerco'
import actions from '../actions'
import { postSig } from '../middleware/grenache.middleware'
import { metamaskSign } from '../middleware/ethereum.middleware'
import TextArea from 'react-textarea-autosize'
import ContainerHeader from './ContainerHeader'
import { connect } from 'react-redux'
import './App.css'

class Signature extends Component {
  constructor (props) {
    super(props)

    this.state = {
      button: null
    }

    this.handleRadio = this.handleRadio.bind(this)
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
    const {
      message,
      signers,
      sigsRequired,
      uuid,
      sigs,
      whitelistPubkeyMap,
      createError,
      handleWeb3
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
    } else if (button === 'ledger') {
      // this.ledgerSign()
    } else {
      // this.web3Sign()
      const data = {
        msg: message,
        signers,
        sigsRequired,
        uuid,
        sigs,
        whitelistMap: whitelistPubkeyMap
      }
      handleWeb3(data)
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
  const whitelist = UI.whitelist || []
  const message = UI.message || null
  const signers = UI.signers || []
  const sigsRequired = UI.sigsRequired || null
  const sigs = UI.sigs || undefined
  const uuid = UI.uuid || undefined
  const whitelistPubkeyMap = UI.whitelistPubkeyMap || null
  const payload = UI.signature_payload || null
  const hash = UI.hash_create || null

  return {
    whitelist,
    message,
    signers,
    whitelistPubkeyMap,
    payload,
    sigsRequired,
    hash,
    sigs,
    uuid
  }
}

function mapDispatchToProps (dispatch) {
  const { UI = {} } = actions
  const {
    errorAction
  } = UI

  return {
    createError: (error = 'Something went wrong.') => {
      const errorOut = errorAction(error)
      dispatch(errorOut)
    },
    postSignature: (args) => {
      dispatch(postSig(args))
    },
    handleWeb3: (payload) => dispatch(metamaskSign(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signature)
