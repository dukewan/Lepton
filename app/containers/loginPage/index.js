'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Image, Modal, ProgressBar } from 'react-bootstrap'
import defaultImage from './github.jpg'

import './index.scss'

class LoginPage extends Component {

  componentWillMount () {
    let loggedInUserInfo = this.props.getLoggedInUserInfo()

    this.setState({
      loggedInUserToken: loggedInUserInfo ? loggedInUserInfo.token : null,
      loggedInUserName: loggedInUserInfo ? loggedInUserInfo.profile : null,
      loggedInUserImage: loggedInUserInfo ? loggedInUserInfo.image : null,
    })
  }

  handleLoginClicked () {
    if (this.props.authWindowStatus === 'OFF') {
      this.setState({
        loggedInUserImage: defaultImage
      })
      this.props.launchAuthWindow()
    }
  }

  handleContinueButtonClicked () {
    if (this.props.authWindowStatus === 'OFF') {
      this.props.launchAuthWindow(this.state.loggedInUserToken)
    }
  }

  renderControlSection () {
    let { loggedInUserName } = this.state
    let { authWindowStatus, userSessionStatus } = this.props

    if (userSessionStatus === 'IN_PROGRESS') {
      return (
        <div className='button-group-modal'>
           <ProgressBar active now={ 100 }/>
        </div>
      )
    }

    if (loggedInUserName === null || loggedInUserName === 'null') {
      return (
        <div className='button-group-modal'>
          <Button
            className={ authWindowStatus === 'OFF' ? 'modal-button' : 'modal-button-disabled' }
            onClick={ this.handleLoginClicked.bind(this) }>
            GitHub Login
          </Button>
        </div>
      )
    }

    return (
      <div className='button-group-modal'>
        <Button
          className='modal-button'
          bsStyle="success"
          onClick={ this.handleContinueButtonClicked.bind(this) }>
          Continue as { loggedInUserName }
        </Button>
        <br/>
        <Button
          className={ authWindowStatus === 'OFF' ? 'modal-button' : 'modal-button-disabled' }
          onClick={ this.handleLoginClicked.bind(this) }>
          Switch Account
        </Button>
      </div>
    )
  }

  renderLoginModalBody () {
    let { loggedInUserName, loggedInUserImage } = this.state

    let profileImage = loggedInUserImage || defaultImage
    if (loggedInUserName === null || loggedInUserName === 'null') {
      profileImage = defaultImage
    }

    return (
      <center>
        <div>
          <Image className='profile-image-modal' src={ profileImage } rounded/>
        </div>
        { this.renderControlSection() }
      </center>
    )
  }

  render () {
    return (
      <div className='login-modal'>
        <Modal.Dialog bsSize='small'>
          <Modal.Header>
            <Modal.Title>Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            { this.renderLoginModalBody() }
          </Modal.Body>
      </Modal.Dialog>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    authWindowStatus: state.authWindowStatus,
    userSessionStatus: state.userSession.activeStatus
  }
}

export default connect(mapStateToProps)(LoginPage)
