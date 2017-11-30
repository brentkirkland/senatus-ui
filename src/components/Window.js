import React, { Component } from 'react'
import '../App.css'

class Window extends Component {
  constructor () {
    super()

    this.state = {
      headerIndex: 0
    }

    this.handleHeaderClick = this.handleHeaderClick.bind(this)
  }

  handleHeaderClick (e) {
    const id = parseInt(e.target.id, 10)
    if (id !== this.state.headerIndex) {
      console.log('header click')
      this.setState({
        headerIndex: parseInt(id, 10)
      })
    }
  }

  handleComponentSwitch (id) {
    this.setState({
      headerIndex: parseInt(id, 10)
    })
  }

  renderHeaderTabs () {
    const { tabs } = this.props
    const { headerIndex } = this.state
    const objects = []
    tabs.forEach((container, index) => {
      let className
      if (index === headerIndex) {
        className = 'window-header-selected'
      } else {
        className = 'window-header-deselected'
      }
      objects.push(
        <div id={index}
          key={`header_${index}`}
          onClick={this.handleHeaderClick}
          className={className}>{container.title}</div>
      )
      if (index < tabs.length - 1) {
        objects.push(
          <div key={`header_${index}_bar`} className='window-header-bar' />
        )
      }
    })
    return objects
  }

  renderHeaderSubtitle () {
    const { headerIndex } = this.state
    const { tabs } = this.props
    return (
      <p>{tabs[headerIndex].subtitle}</p>
    )
  }

  renderHeader () {
    return (
      <div className='window-header'>
        {this.renderHeaderTabs()}
      </div>
    )
  }

  renderContainer () {
    const { headerIndex } = this.state
    const { tabs } = this.props
    return tabs[headerIndex].component
  }

  render () {
    return (
      <div className='App-window'>
        {this.renderHeader()}
        {this.renderHeaderSubtitle()}
        <br />
        {this.renderContainer()}
      </div>
    )
  }
}

export default Window
