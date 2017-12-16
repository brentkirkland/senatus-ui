import React, { Component } from 'react'
import './App.css'

class Search extends Component {
  // TODO:// required props
  constructor (props) {
    super(props)

    this.state = {
      hash: ''
    }

    this.handleSearchText = this.handleSearchText.bind(this)
    this.handleEnter = this.handleEnter.bind(this)
    this.pushTo = this.pushTo.bind(this)
  }

  handleSearchText (e) {
    const { value } = e.target
    this.setState({
      hash: value
    })
  }

  handleEnter (e) {
    const { key } = e
    if (key === 'Enter') {
      this.pushTo()
    }
  }

  pushTo () {
    const { hash } = this.state
    const { history } = this.props
    history.push('/proposal/' + hash)
  }

  render () {
    const { hash } = this.state
    return (
      <div className='App-search'>
        <input className='App-search-input'
          onKeyPress={this.handleEnter}
          onChange={this.handleSearchText}
          value={hash}
          placeholder='Enter a hash' />
        <input
          type='submit'
          defaultValue='Go'
          onClick={this.pushTo}
          className='App-search-button' />
      </div>
    )
  }
}

export default Search
