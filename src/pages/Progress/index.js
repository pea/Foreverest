import React, { Component } from 'react'
import { loadApp, updatePageTitle } from 'actions/app'

import Button from 'components/button'
import GeneratedMountain from 'components/generatedMountain'
import StatusBar from 'components/statusBar'
import config from 'config'
import { connect } from 'react-redux'
import gridStyles from 'css/adaptivegrid.scss'
import { push } from 'connected-react-router'
import request from 'superagent'
import store from '../../store'
import styles from 'pages/Progress/styles.scss'
import { updateUser } from 'actions/user'

type Props = {
  dispatch: () => void,
  loaded: boolean,
  user: object
}

export class AppContainer extends Component {
  constructor(props){
    super(props)
  }
  
  componentDidMount() {
    this.props.dispatch(loadApp())
    this.props.dispatch(updatePageTitle(''))
    this.props.dispatch(updateUser())
  }

  props: Props

  render() {
    if (!this.props.loaded) {
      return null
    }

    return (
      <div>
        <GeneratedMountain percentage={this.props.user.percentage} />
        <StatusBar feet={this.props.user.feet} remaining={this.props.user.remaining} percentage={this.props.user.percentage} />
      </div>
    )
  }
}

function mapStateToProperties(state) {
  return {
    loaded: state.app.loaded,
    user: state.app.user
  }
}

export default connect(mapStateToProperties)(AppContainer)
