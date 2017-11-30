import React, { Component } from 'react'
import './App.css'

class Signature extends Component {
  constructor (props) {
    super(props)

    this.state = {
      button: ''
    }

    this.handleRadio = this.handleRadio.bind(this)
  }

  handleRadio (e) {
    const { value } = e.target
    this.setState({
      button: value
    })
  }

  render () {
    const { button } = this.state
    return (
      <div className='App-container'>
        <form>
          <label>
            <input type='radio' value='metamask'
              checked={(button === 'metamask')}
              onChange={this.handleRadio} />
                MetaMask
          </label>
          <label>
            <input type='radio' value='ledger'
              checked={(button === 'ledger')}
              onChange={this.handleRadio} />
            Ledger Wallet
          </label>
          <label>
            <input type='radio' value='trezor'
              checked={(button === 'trezor')}
              onChange={this.handleRadio} />
            Trezor
          </label>
        </form>
      </div>
    )
  }
}

export default Signature
