import React, { Component } from 'react'
import { loadApp, updatePageTitle } from 'actions/app'

import Button from 'components/button/index'
import { Link } from 'react-router-dom'
import _ from 'underscore'
import config from 'config'
import { connect } from 'react-redux'
import gridStyles from 'css/adaptivegrid.scss'
import { push } from 'connected-react-router'
import store from '../../store'
import styles from 'pages/Index/styles.scss'
import { updateUser } from 'actions/user'

type Props = {
  dispatch: () => void,
  loaded: boolean,
  user: object
}

export class AppContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showContinueButton: false
    }
  }

  componentDidMount() {
    this.props.dispatch(loadApp())
    this.props.dispatch(updatePageTitle('Foreverest'))
    this.props.dispatch(updateUser())
      .then(() => {
        this.state.showContinueButton = true
        this.setState(this.state)
      })
  }

  props: Props

  render() {
    if (!this.props.loaded) {
      return null
    }

    return (
      <div>
        <div className={[gridStyles.grid, styles.container, gridStyles.positionCenter, gridStyles.positionTop].join(' ')}>
        <div className={[gridStyles.col, gridStyles.perc100, styles.HeaderFeatureCol, gridStyles.smallestShow, gridStyles.smallerShow, gridStyles.smallShow].join(' ')} />
        <div className={[gridStyles.col, gridStyles.fixedWidth, styles.captionCol].join(' ')}>
            <div className={[styles.caption].join(' ')}>
              <h1>Foreverest</h1>
              <p>
                The struggle itself towards the heights is enough to fill a person's heart. One must imagine Sisyphus happy.
              </p>
              <p>
                Connect to Strava and see how far you can cycle up the infinitely tall Mount Foreverest.
              </p>
              {this.state.showContinueButton &&
                <div>
                  {this.props.user.stravaId == 0 && <Link to={'/progress'} className={styles.button}>Take a Look</Link>}
                  {this.props.user.stravaId > 0 && <Link to={'/progress'} className={styles.button}>Continue</Link>}
                </div>
              }
                
            </div>
          </div>
          <div className={[gridStyles.col, gridStyles.fillWidth, styles.featureCol, gridStyles.smallestHide, gridStyles.smallerHide, gridStyles.smallHide].join(' ')} />
        </div>
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
