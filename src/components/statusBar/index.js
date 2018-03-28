import React, { Component } from 'react'

import { connect } from 'react-redux'
import gridStyles from 'css/adaptivegrid.scss'
import { loadApp } from 'actions/app'
import styles from 'components/statusBar/styles.scss'

type Props = {
  dispatch: () => void,
  loaded: boolean,
  feet: int,
  remaining: int,
  percentage: int
}

export class MountainGraph extends Component {
  componentDidMount() {
    this.props.dispatch(loadApp())
  }

  props: Props

  render() {
    if (!this.props.loaded) {
      return null
    }

    return (
      <div>
        <div className={styles.stats}>
          <div className={[gridStyles.grid, gridStyles.gut20].join(' ')}>
            <div className={[gridStyles.col, gridStyles.fillWidth].join(' ')}>
              {this.props.feet}<span className={styles.unit}>FT</span>
              <div className={styles.label}>Elevation</div>
            </div>
            {this.props.percentage < 100 && 
              <div className={[gridStyles.col, gridStyles.fillWidth].join(' ')}>
                {this.props.remaining}<span className={styles.unit}>FT</span>
                <div className={styles.label}>Remaining</div>
              </div>
            }
            <div className={[gridStyles.col, gridStyles.fillWidth].join(' ')}>
              {this.props.percentage < 100 && <div>{this.props.percentage}<span className={styles.unit}>%</span></div>}
              {this.props.percentage > 100 && <div>{this.props.percentage / 100}<span className={styles.unit}>Everests</span></div>}
              <div className={styles.label}>Completed</div>
            </div>
          </div>
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

export default connect(mapStateToProperties)(MountainGraph)
