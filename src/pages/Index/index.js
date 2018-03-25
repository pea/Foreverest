import React, { Component } from 'react'
import { loadApp, updatePageTitle } from 'actions/app'

import Button from 'components/button/index'
import { Link } from 'react-router-dom'
import _ from 'underscore'
import config from 'config'
import { connect } from 'react-redux'
import { getUser } from 'actions/user'
import gridStyles from 'css/adaptivegrid.scss'
import { push } from 'connected-react-router'
import store from '../../store'
import styles from 'pages/Index/styles.scss'

type Props = {
  dispatch: () => void,
  loaded: boolean,
  user: object
}

export class AppContainer extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.dispatch(loadApp())
    this.props.dispatch(updatePageTitle('Foreverest'))
    this.props.dispatch(getUser())
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
              <p>Small herbs have grace; great weeds do grow apace. And since, methinks I would not grow so fast, because sweet flowers are slow and weeds make haste.</p>
              <Link to={_.isEmpty(this.props.user) ? '/connect' : '/progress'} className={styles.button}>Continue</Link>
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
