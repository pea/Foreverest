import React, { Component } from 'react'

import { connect } from 'react-redux'
import { loadApp } from 'actions/app'

type Props = {
  dispatch: () => void,
  loaded: boolean
}

export class AppContainer extends Component {
  componentDidMount() {
    this.props.dispatch(loadApp())
  }

  props: Props

  render() {
    if (!this.props.loaded) {
      return null
    }

    return (
      <div />
    )
  }
}

function mapStateToProperties(state) {
  return {
    loaded: state.app.loaded
  }
}

export default connect(mapStateToProperties)(AppContainer)
