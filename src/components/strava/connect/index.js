import React, { Component } from 'react'

import Button from 'components/button/index'
import config from 'config'
import { connect } from 'react-redux'
import { loadApp } from 'actions/app'
import request from 'superagent'

type Props = {
  dispatch: () => void,
  loaded: boolean
}

export class AppContainer extends Component {
  componentDidMount() {
    this.props.dispatch(loadApp())
    this.handleClick = this.handleClick.bind(this)
  }

  props: Props

  handleClick() {
    if (typeof window === 'undefined') return
    window.location = `${config.api.endpoint}/auth/strava/authenticate`
  }

  render() {
    if (!this.props.loaded) {
      return null
    }

    return (
      <Button type="strava" position="" align="center" text="Connect with Strava" onClick={this.handleClick} classes={[this.props.classes].join(' ')} />
    )
  }
}

function mapStateToProperties(state) {
  return {
    loaded: state.app.loaded
  }
}

export default connect(mapStateToProperties)(AppContainer)
