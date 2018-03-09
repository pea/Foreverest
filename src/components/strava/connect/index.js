import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadApp } from 'actions/app'
import Button from 'components/button/index'
import request from 'superagent'
import config from 'config'

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
    window.location = `${config.api.endpoint}/auth/strava/authenticate`
  }

  render() {
    if (!this.props.loaded) {
      return null
    }

    return (
      <Button type="strava" position="" align="center" text="Connect" onClick={this.handleClick} />
    )
  }
}

function mapStateToProperties(state) {
  return {
    loaded: state.app.loaded
  }
}

export default connect(mapStateToProperties)(AppContainer)
