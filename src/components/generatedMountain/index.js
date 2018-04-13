import React, { Component } from 'react'
import { curveBasis, d3, easeExpOut, easeLinear, line, range, scaleLinear, select, symbol, symbolTriangle } from 'd3'

import Hammer from 'hammerjs'
import ReactDOM from 'react-dom'
import _ from 'underscore'
import { connect } from 'react-redux'
import createStage from './_createStage'
import { loadApp } from 'actions/app'
import plotCameraPoint from './_plotCameraPoint';
import plotCheckpoints from './_plotCheckpoints'
import plotUserPointer from './_plotUserPointer';
import plotUsers from './_plotUsers'
import scrollToWithAnimation from 'scrollto-with-animation'
import styles from 'components/generatedMountain/style.scss'
import timeAgoPoints from './_timeAgoPoints'
import translateAlong from './_translateAlong'
import translateCameraAlong from './_translateCameraAlong'

type Props = {
  dispatch: () => void,
  loaded: boolean,
  percentage: int,
  percentageYearAgo: int,
  percentageQuarterAgo: int,
  users: object
}

export class GeneratedMountain extends Component {  
  constructor(props){
    super(props)
    this.state = {
      initiated: false,
      usersPlotted: false,
      pointer: {},
      cameraPointer: {},
      yearAgoPointer: {},
      quarterAgoPointer: {},
      path: {},
      container: {},
      svg: {},
      cameraData: 0,
      maxDistance: .8,
      everestPercentage: 5,
      yearAgoLabelFeetLine: '',
      quarterAgoLabelFeetLine: '',
      timeAgos: {}
    }
    this.state.everestDistance = (this.state.maxDistance / 100) * this.state.everestPercentage
  }

  props: Props

  componentDidMount() {
    this.props.dispatch(loadApp())
    this.init(
      this.props.percentage,
      this.props.percentageYearAgo,
      this.props.percentageQuarterAgo,
      this.props.feet,
      this.props.feetYearAgo,
      this.props.feetQuarterAgo,
      this.props.users,
      this.props.user
    )    
    
    Object.assign(this.state, 
      this.props.users,
      this.props.user,
      this.state
    )
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.percentage !== this.props.percentage) {
      if (this.state.initiated === true) {
        this.update(nextProps.percentage)
      } else {
        this.init(nextProps.percentage)
      }
    }
    if (nextProps.feetYearAgo !== this.props.feetYearAgo
      || nextProps.feetQuarterAgo !== this.props.feetQuarterAgo) {
      if (this.state.initiated === true) {
        const timeAgos = timeAgoPoints.init([
          { percentage: nextProps.percentageYearAgo, feet: nextProps.feet, text: 'Year Ago'},
          { percentage: nextProps.percentageQuarterAgo, feet: nextProps.feetQuarterAgo, text: '¼ Year Ago'},
        ], this.state, nextProps.feet)
        Object.assign(this.state, timeAgos)
      }
    }
    if (_.size(nextProps.users) !== _.size(this.props.users)) {
      Object.assign(this.state, plotUsers(
        nextProps.users,
        this.props.user,
        this.state
      ))
    }
    if (nextProps.user.stravaId !== this.props.user.stravaId) {
      Object.assign(this.state, plotUsers(
        nextProps.users,
        nextProps.user,
        this.state
      ))
    }
  }

  update(percentage) {
    let distance = 0
    if (percentage == 0) return
    const value = (this.state.everestDistance / 100) * percentage

    this.state.cameraData = value

    if (!_.size(this.state.pointer) > 0) {
      distance = (this.state.everestDistance / 100) * percentage
      distance = distance > this.state.maxDistance ? this.state.maxDistance : distance
      plotUserPointer(this.state, distance)
    } else {
      this.state.pointer
        .data([value])
        .transition()
        .duration(5000)
        .ease(easeExpOut)
        .attrTween("transform", (d) => {
            return translateAlong(d, this.state.path.node(), this.state)()
        })
    
      }
    this.state.cameraPointer
      .data([value])
      .transition()
      .duration(5000)
      .ease(easeExpOut)
      .attrTween("transform", (d) => {
          return translateCameraAlong(d, this.state.path.node(), this.state)()
      })
    this.state.yearAgoLabelFeetLine
      .text
  }

  init(percentage, percentageYearAgo, percentageQuarterAgo, feet, feetYearAgo, feetQuarterAgo, users, user) {
    if (typeof window === 'undefined') return

    this.state.container = ReactDOM.findDOMNode(this.refs.container)

    Object.assign(this.state, createStage(this.state, this.refs.chart))

    plotCheckpoints(this.state)
    
    const timeAgos = timeAgoPoints.init([
      { percentage: percentageYearAgo, feet: feetYearAgo, text: 'Year Ago'},
      { percentage: percentageQuarterAgo, feet: feetQuarterAgo, text: '¼ Year Ago'},
    ], this.state, feet)
    Object.assign(this.state, timeAgos)

    let distance = 0

    if (percentage > 0) {
      distance = (this.state.everestDistance / 100) * percentage
      distance = distance > this.state.maxDistance ? this.state.maxDistance : distance
      Object.assign(this.state, plotUserPointer(this.state, distance))
    }

    Object.assign(this.state, plotCameraPoint(this.state, distance))

    Object.assign(this.state, plotUsers(
      users,
      user,
      this.state
    ))

    this.state.initiated = true
  }

  render() {
    if (!this.props.loaded) {
      return null
    }

    return (
      <div>
        <div className={styles.generatedMountainContainer} ref="container">
          <div ref="chart" className={styles.chart}></div>
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

export default connect(mapStateToProperties)(GeneratedMountain)
