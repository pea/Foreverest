import React, { Component } from 'react'
import { getUsers, updateUser } from 'actions/user'
import { loadApp, updatePageTitle } from 'actions/app'

import Button from 'components/button'
import GeneratedMountain from 'components/generatedMountain'
import StatusBar from 'components/statusBar'
import _ from 'underscore'
import config from 'config'
import { connect } from 'react-redux'
import gridStyles from 'css/adaptivegrid.scss'
import { push } from 'connected-react-router'
import request from 'superagent'
import store from '../../store'
import styles from 'pages/Progress/styles.scss'

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
    this.props.dispatch(getUsers())
    this.users = {}
  }

  props: Props

  render() {
    if (!this.props.loaded) {
      return null
    }
    

    return (
      <div>
        <div className={this.props.user.stravaId > 0 ? styles.accomodateStatusBar : ''}>
          <GeneratedMountain
            percentage={this.props.user.percentage}
            percentageYearAgo={this.props.user.percentageYearAgo}
            percentageQuarterAgo={this.props.user.percentageQuarterAgo}
            feet={this.props.user.feet}
            feetYearAgo={this.props.user.feetYearAgo}
            feetQuarterAgo={this.props.user.feetQuarterAgo}
            users={this.props.users}
            user={this.props.user} />
        </div>
        
        {this.props.user.feet > 0 &&
          <StatusBar
            feet={this.props.user.feet}
            remaining={this.props.user.remaining}
            percentage={this.props.user.percentage} />
        }
      </div>
    )
  }
}

function mapStateToProperties(state) {
  return {
    loaded: state.app.loaded,
    user: state.app.user,
    users: state.app.users
  }
}

export default connect(mapStateToProperties)(AppContainer)
