import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadApp, updatePageTitle } from 'actions/app'
import StravaConnect from 'components/strava/connect/index'
import Button from 'components/button'
import config from '../../config'

import styles from 'pages/Connect/styles.scss'
import gridStyles from 'css/adaptivegrid.scss'

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
      <div className={[gridStyles.grid, gridStyles.gut20, gridStyles.outergut].join(' ')}>
        <div className={[gridStyles.col, gridStyles.perc100].join(' ')}>
          Please connect with Strava to start using Foreverest.
        </div>
        <div className={[gridStyles.col, gridStyles.perc100].join(' ')}>
          <StravaConnect />
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
