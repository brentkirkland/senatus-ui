import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import Greeting from './Greeting'
import CreateProposal from './CreateProposal'
import SignProposal from './SignProposal'
import NotFound from './NotFound'
import Search from './Search'
import './App.css'

class App extends Component {
  render () {
    return (
      <Router>
        <div className='App'>
          <header className='App-header'>
            <div className='App-header-container'>
              <Link className='App-title-link' to='/'>
                <h1 className='App-title'>Senatus</h1>
              </Link>
              <Route component={Search} />
            </div>
          </header>
          <div className='App-space'>
            <Greeting />
            <Switch>
              <Route exact path='/' component={CreateProposal} />
              <Route path='/proposal/*' component={SignProposal} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}

export default App
