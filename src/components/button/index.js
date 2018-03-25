import React, { Component } from 'react'

import { connect } from 'react-redux'
import { loadApp } from 'actions/app'
import styles from 'components/button/styles.scss'

type Props = {
  dispatch: () => void,
  loaded: boolean,
  text: string,
  type: string,
  position: string,
  align: string
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
      <div
        className={styles[`align${capitalizeFirstLetter(this.props.align)}`]}
      >
        <div
          className={[
            styles.button,
            styles[`type${capitalizeFirstLetter(this.props.type)}`],
            styles[`position${capitalizeFirstLetter(this.props.position)}`],
          ].concat(this.props.classes).join(' ')}
          onClick={this.props.onClick}
        >
          {this.props.text}
        </div>
      </div>
    )
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function mapStateToProperties(state) {
  return {
    loaded: state.app.loaded
  }
}

export default connect(mapStateToProperties)(AppContainer)
