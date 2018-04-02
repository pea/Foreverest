import React, { Component } from 'react'
import { curveBasis, d3, easeExpOut, easeLinear, line, range, scaleLinear, select, symbol, symbolTriangle } from 'd3'

import Hammer from 'hammerjs'
import ReactDOM from 'react-dom'
import _ from 'underscore'
import { connect } from 'react-redux'
import createState from './_createStage'
import { loadApp } from 'actions/app'
import plotCheckpoints from './_plotCheckpoints'
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
      direction: -1,
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
    if (percentage == 0) return
    const value = (this.state.everestDistance / 100) * percentage

    this.state.cameraData = value
    this.state.pointer
      .data([value])
      .transition()
      .duration(5000)
      .ease(easeExpOut)
      .attrTween("transform", (d) => {
          return translateAlong(d, this.state.path.node(), this.state)()
      })
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

  init(percentage, percentageYearAgo, percentageQuarterAgo, feet, feetYearAgo, feetQuarterAgo) {
    if (!percentage && percentage != 0) return
    if (typeof window === 'undefined') return

    this.state.container = ReactDOM.findDOMNode(this.refs.container)

    Object.assign(this.state, createState(this.state, this.refs.chart))

    plotCheckpoints(this.state)
    
    const timeAgos = timeAgoPoints.init([
      { percentage: percentageYearAgo, feet: feetYearAgo, text: 'Year Ago'},
      { percentage: percentageQuarterAgo, feet: feetQuarterAgo, text: '¼ Year Ago'},
    ], this.state, feet)
    Object.assign(this.state, timeAgos)

    let distance = (this.state.everestDistance / 100) * percentage

    distance = distance > this.state.maxDistance ? this.state.maxDistance : distance

    this.state.cameraData = distance

    const g = this.state.svg.append('g')
      .attr('transform', 'translate(0,0)')

    this.state.cameraPointer = g.append('g')
      .data([this.state.cameraData])

    this.state.pointer = g.append('g')
      .data([distance])
      .data([this.state.cameraData])

    const tri = this.state.pointer
      .append('path')
      .attr('class', styles.tri)
      .attr('d', symbol().type(symbolTriangle).size(100)())

    const camera = this.state.cameraPointer
      .append('path')
      .attr('class', styles.camera)
      .attr('d', symbol().type(symbolTriangle).size(100)())

    const transition = () => {
      this.state.direction *= -1
      this.state.pointer.transition()
        .duration(5000)
        .ease(easeExpOut)
        .attrTween('transform', (d) => {
            return translateAlong(d, this.state.path.node(), this.state)()
        })

        this.state.cameraPointer
        .transition()
        .duration(5000)
        .ease(easeExpOut)
        .attrTween('transform', (d) => {
          return translateCameraAlong(d, this.state.path.node(), this.state)()
        })
      
      document.addEventListener('wheel', (e) => {
        const data = this.state.cameraData += (e.deltaX / 100000)
        if (data > this.state.maxDistance) return
        this.state.cameraPointer = this.state.cameraPointer.data([data])
        this.state.cameraData = this.state.cameraData < 0 ? 0 : this.state.cameraData
        this.state.cameraPointer
          .transition()
          .duration(0)
          .attrTween('transform', (d) => {
            return translateCameraAlong(d, this.state.path.node(), this.state)()
          })
      })

      new Hammer(this.state.container).on('panleft panright', (e) => {
        let distance = e.distance > 50 ? 50 : e.distance
        if (e.type === 'panleft') {
          let pranLeftData = this.state.cameraData += (distance / 100000)
          if (pranLeftData > this.state.maxDistance) return
          this.state.cameraPointer = this.state.cameraPointer.data([pranLeftData])
        } else {
          this.state.cameraPointer = this.state.cameraPointer.data([this.state.cameraData -= (distance / 100000)])
        }
        this.state.cameraData = this.state.cameraData < 0 ? 0 : this.state.cameraData
        this.state.cameraPointer
          .transition()
          .duration(0)
          .attrTween('transform', (d) => {
            return translateCameraAlong(d, this.state.path.node(), this.state)()
          }) 
      });
      
    }
  
    transition()

    ReactDOM.findDOMNode(this.state.container).scrollTop = '99999'
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
