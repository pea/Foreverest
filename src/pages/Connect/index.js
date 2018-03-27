import React, { Component } from 'react'
import { loadApp, updatePageTitle } from 'actions/app'

import Button from 'components/button'
import StravaConnect from 'components/strava/connect/index'
import config from '../../config'
import { connect } from 'react-redux'
import gridStyles from 'css/adaptivegrid.scss'
import styles from 'pages/Connect/styles.scss'

type Props = {
  dispatch: () => void,
  loaded: boolean
}

export class AppContainer extends Component {
  componentDidMount() {
    this.props.dispatch(loadApp())
    this.props.dispatch(updatePageTitle('Connect with Strava'))
  }

  props: Props

  render() {
    if (!this.props.loaded) {
      return null
    }

    return (
      <div className=
        {
          [
            styles.grid, gridStyles.grid, gridStyles.gut40,
            gridStyles.outergut, gridStyles.positionMiddle, gridStyles.positionCenter
          ].join(' ')
        }>
        <div className={[styles.containerCol].join(' ')}>
          Please connect to Strava to give Foreverest permission to sync your elevation data.
          <StravaConnect classes={styles.button} />
        </div>
      </div>
    )
  }
}

function mapStateToProperties(state) {
  return {
    loaded: state.app.loaded
  }
}

export default connect(mapStateToProperties)(AppContainer)
