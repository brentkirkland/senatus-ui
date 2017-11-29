import React, { Component } from 'react'
import Web3 from 'web3'
import sigUtil from 'eth-sig-util'
import TextArea from 'react-textarea-autosize'
import {BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Window from './components/Window'
import CreateProposal from './components/CreateProposal'
import SignProposal from './components/SignProposal'
import './App.css'

class App extends Component {
  constructor () {
    super()

    this.state = {
      web3: null,
      message: '',
      signedMessage: null,
      jsonMessage: JSON.stringify(this.getPlaceholder()),
      method: null
    }

    this.handleRadio = this.handleRadio.bind(this)
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
      if (recovered.toUpperCase() === from.toUpperCase()) {
        // window.alert('Recovered signer: ' + from)
        setSignedMessage(result.result, 'metamask')
      } else {
        window.alert('Failed to verify signer, got: ' + result)
      }
    })
  }

  setSignedMessage (result, method) {
    this.setState({
      'signedMessage': result,
      'method': method,
      'jsonMessage': {
        signedMessage: result,
        method: method
      }
    })
  }

  handleTextAreaChange (e) {
    this.setState({
      message: e.target.value
    })
  }

  handleRadio (e) {
    console.log(e.target.value)
    if (e.target.value === 'metamask') {
      console.log('do nothing')
    }
  }

  getPlaceholder () {
    const placeholder = {
      uuid: 1,
      message: 'Should we use Senatus as a team?',
      quorum: 2,
      signers: ['Robert', 'Fei', 'Paolo'],
      creator: 'Brent',
      signatures: [],
      timestamp: Date.now(),
      complete: false
    }
    return placeholder
  }

  renderSignProposal () {
    // replaced by component
    return (
      <div className='App-container'>
        <h4>Create a proposal that requires group concensus.</h4>
        <div className='App-body'>
          <TextArea
            placeholder='Enter message' />
        </div>
        <div className='App-body'>
          <TextArea
            placeholder='Add signers' />
        </div>
        <div className='App-body'>
          <TextArea
            placeholder='Number of Signatures Required' />
        </div>
        <div className='App-body'>
          <TextArea
            placeholder='Number of Signatures Required' />
        </div>
        <div className='App-body'>
          <input
            value='Create Proposal'
            type='Submit' />
        </div>
        <h2>Steps</h2>
        <div className='App-body'>
          <ul>
            <li>Enter hash</li>
            <li><i>Send hash to Senatus</i></li>
            <li>Select signers from whitelist</li>
            <li>Select consensus majority number</li>
            <li>Submit</li>
          </ul>
        </div>
      </div>
    )
  }

  renderCreateProposal () {
    // replaced by component
    return (
      <div className='App-container'>
        <h2>Create Proposal</h2>
        <div className='App-body'>
          <h3>Message</h3>
          <textarea
            placeholder='Enter a json message' />
        </div>
        <div className='App-body'>
          <h3>Steps</h3>
          <ul>
            <li>Enter message</li>
            <li>Select signers from whitelist</li>
            <li>Select consensus majority number</li>
            <li>Sign</li>
            <li>Submit</li>
          </ul>
        </div>
      </div>
    )
  }

  switchProcess (process = 'sign') {
    // if (process === 'sign') {
    //   return this.renderSignProposal()
    // } else {
    //   return this.renderCreateProposal()
    // }
    const tabs = [
      {
        title: 'Create Proposal',
        subtitle: 'Create a proposal that requires group concensus.',
        component: <CreateProposal />
      }
    ]
    return <Window tabs={tabs} />
  }

  renderSign (process = 'sign') {
    // if (process === 'sign') {
    //   return this.renderSignProposal()
    // } else {
    //   return this.renderCreateProposal()
    // }
    const tabs = [
      {
        title: 'Sign Proposal',
        subtitle: 'Review and sign the following proposal to reach group concensus.',
        component: <SignProposal />
      }
    ]
    return <Window tabs={tabs} />
  }

  showStyleGuide () {
    const boo = true
    // dev switch
    if (boo) {
      return (
        <div className='App-space'>
          <div className='App-window'>
            <div className='App-container'>
              <h2>Style Guide</h2>
              <div className='App-body'>
                <h1>This is an h1 header</h1>
                <h2>This is an h2 header</h2>
                <h3>This is an h3 header</h3>
                <h4>This is an h4 header</h4>
                <span>This is a span</span>
                <p>This is a paragraph</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  // render () {
  //   return (
  //     <div className='App'>
  //       <header className='App-header'>
  //         <h1 className='App-title'>Senatus</h1>
  //         <div className='App-search'>
  //           <input className='App-search-input'
  //             placeholder='Enter a hash to view proposal' />
  //           <input type='submit' value='Go' className='App-search-button' />
  //         </div>
  //       </header>
  //       <br />
  //       <div className='App-space'>
  //         {this.switchProcess()}
  //         {this.renderSign()}
  //         <br />
  //         <br />
  //         <br />
  //         <br />
  //         <br />
  //         <br />
  //         <br />
  //         <br />
  //         <br />
  //         <br />
  //         <br />
  //         <br />
  //         <div className='App-window'>
  //           <h1>Mechanisms</h1>
  //           <p>Here you will find the working parts that will make up the proccesses. You will not see this in the future.</p>
  //           <div className='App-container'>
  //             <h2>Sign Message</h2>
  //             <div className='App-body'>
  //               <h3>Message</h3>
  //               <textarea
  //                 onChange={this.handleTextAreaChange.bind(this)}
  //                 value={this.state.message}
  //                 placeholder='Enter a unique message here' />
  //             </div>
  //             <div className='App-body'>
  //               <h3>Method</h3>
  //               <form>
  //                 <div className='radio'>
  //                   <label>
  //                     <input type='radio' value='metamask'
  //                       onChange={this.handleRadio}
  //                       checked={this.state.method === 'metamask'} />
  //                     MetaMask
  //                   </label>
  //                 </div>
  //                 <div className='radio'>
  //                   <label>
  //                     <input type='radio' value='ledger'
  //                       onChange={this.handleRadio}
  //                       checked={this.state.method === 'ledger'} />
  //                     Ledger Wallet
  //                   </label>
  //                 </div>
  //                 <div className='radio'>
  //                   <label>
  //                     <input type='radio' value='trezor'
  //                       onChange={this.handleRadio}
  //                       checked={this.state.method === 'trezor'} />
  //                     Trezor
  //                   </label>
  //                 </div>
  //                 <div className='button'>
  //                   <input type='submit' value='Sign Message' />
  //                 </div>
  //               </form>
  //             </div>
  //             <div className='App-body'>
  //               <h3>Response</h3>
  //               <span>{JSON.stringify({signedMessage: this.state.signedMessage, method: this.state.method})}</span>
  //             </div>
  //             <div className='App-body'>
  //               <h3>Does it work?:</h3>
  //               <textarea
  //                 placeholder='Enter a json message' />
  //             </div>
  //           </div>
  //           <div className='App-container'>
  //             <h2>Verify Message</h2>
  //             <div className='App-body'>
  //               <h3>Message</h3>
  //               <textarea
  //                 placeholder='Enter a json message' />
  //             </div>
  //           </div>
  //           <div className='App-container'>
  //             <h2>Users</h2>
  //             <div className='App-body'>
  //               <h3>Whitelist</h3>
  //               <p>This is a list of people on the whitelist</p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       {this.showStyleGuide()}
  //       <div className='App-body'>
  //         <p className='App-intro'>
  //           Welcome to the beginning of Senatus. This is currently a sketch pad and does not represent the completed product.
  //         </p>
  //         <h3>TODO</h3>
  //         <ul>
  //           <li>Setup Redux Sagas</li>
  //           <li>Setup app structure</li>
  //           <li>Get Whitelist</li>
  //           <li>Get list</li>
  //           <li>Get sign</li>
  //           <li>Get validate</li>
  //           <li>Config file</li>
  //         </ul>
  //       </div>
  //     </div>
  //   )
  // }

  render () {
    const tabs = [
      {
        title: 'Create Proposal',
        subtitle: 'Create a proposal that requires group concensus.',
        component: <CreateProposal />
      },
      {
        title: 'Sign Proposal',
        subtitle: 'Review and sign the following proposal to reach group concensus.',
        component: <SignProposal />
      }
    ]
    const CreatePage = (props) => {
      return (
        <Window tabs={[tabs[0]]} {...props} />
      )
    }
    const SignPage = (props) => {
      return (
        <Window tabs={[tabs[1]]} {...props} />
      )
    }
    return (
      <Router>
        <div className='App'>
          <header className='App-header'>
            <h1 className='App-title'>Senatus</h1>
            <div className='App-search'>
              <input className='App-search-input'
                placeholder='Enter a hash to view proposal' />
              <input type='submit' value='Go' className='App-search-button' />
            </div>
          </header>
          <div className='App-space'>
            <Route exact path='/' render={SignPage} />
            <Route path='/a/*' render={CreatePage} />
          </div>
        </div>
      </Router>
    )
  }
}

export default App
