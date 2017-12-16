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

  render () {
    return (
      <div className='window-header'>
        {this.renderHeaderTabs()}
      </div>
    )
  }
}

export default ContainerHeader
