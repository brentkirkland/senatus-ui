import React, { Component } from 'react'
import './App.css'

class ContainerHeader extends Component {
  renderHeaderTabs () {
    const { titles } = this.props
    const objects = []
    titles.forEach((title, index) => {
      let className
      if (index === 0) {
        className = 'window-header-selected'
      } else {
        className = 'window-header-deselected'
      }
      objects.push(
        <div id={index}
          key={`header_${index}`}
          className={className}>{title}</div>
      )
    })
    return objects
  }

  renderHeader () {
    const { error, success } = this.props
    if (error) {
      return (
        <div className='window-header-error'>
          <div
            key={`header_error`}
            className={'window-header-selected'}>Error</div>
        </div>
      )
    }
    if (success) {
      return (
        <div className='window-header-success'>
          {this.renderHeaderTabs()}
        </div>
      )
    }
    return (
      <div className='window-header'>
        {this.renderHeaderTabs()}
      </div>
    )
  }

  render () {
    return this.renderHeader()
  }
}

export default ContainerHeader
