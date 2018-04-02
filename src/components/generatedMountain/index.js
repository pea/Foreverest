import React, { Component } from 'react'
import { curveBasis, d3, easeExpOut, easeLinear, line, range, scaleLinear, select, symbol, symbolTriangle } from 'd3'

import Hammer from 'hammerjs'
import ReactDOM from 'react-dom'
import _ from 'underscore'
import { connect } from 'react-redux'
import { loadApp } from 'actions/app'
import scrollToWithAnimation from 'scrollto-with-animation'
import styles from 'components/generatedMountain/style.scss'

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
      atLength: 0,
      cameraAtLength: 0,
      container: {},
      svg: {},
      cameraData: 0,
      maxDistance: .8,
      everestPercentage: 5,
      yearAgoLabelFeetLine: '',
      quarterAgoLabelFeetLine: ''
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
    this.plotUsers(this.props.users, this.props.user)
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
        this.updateLabels(
          nextProps.percentageYearAgo,
          nextProps.percentageQuarterAgo,
          nextProps.feet,
          nextProps.feetYearAgo,
          nextProps.feetQuarterAgo
        )
      } else {
        this.updateLabels(
          nextProps.percentageYearAgo,
          nextProps.percentageQuarterAgo,
          nextProps.feet,
          nextProps.feetYearAgo,
          nextProps.feetQuarterAgo
        )
      }
    }
    if (_.size(nextProps.users) !== _.size(this.props.users)) {
      this.plotUsers(nextProps.users, this.props.user)
    }
    if (nextProps.user.stravaId !== this.props.user.stravaId) {
      this.plotUsers(nextProps.users, nextProps.user)
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
          return this.translateAlong(d, this.state.path.node())()
      })
    this.state.cameraPointer
      .data([value])
      .transition()
      .duration(5000)
      .ease(easeExpOut)
      .attrTween("transform", (d) => {
          return this.translateCameraAlong(d, this.state.path.node())()
      })
    this.state.yearAgoLabelFeetLine
      .text
  }

  updateLabels(percentageYearAgo, percentageQuarterAgo, feet, feetYearAgo, feetQuarterAgo) {
    const valueYearAgo = (this.state.everestDistance / 100) * percentageYearAgo
    const valueQuarterAgo = (this.state.everestDistance / 100) * percentageQuarterAgo

    this.state.yearAgoPointer
      .data([valueYearAgo])
      .transition()
      .duration(0)
      .ease(easeExpOut)
      .attrTween("transform", (d) => {
          return this.translateAlong(d, this.state.path.node())()
      })
    this.state.quarterAgoPointer
      .data([valueQuarterAgo])
      .transition()
      .duration(0)
      .ease(easeExpOut)
      .attrTween("transform", (d) => {
          return this.translateAlong(d, this.state.path.node())()
      })
    this.state.quarterAgoLabelFeetLine
      .text(`-${feet - feetQuarterAgo} FT`)
    this.state.yearAgoLabelFeetLine
      .text(`-${feet - feetYearAgo} FT`)
  }

  plotUsers(users, user) {
    if (this.state.usersPlotted) return
    if (user.stravaId <= 0) return
    if (_.size(users) == 0) return

    users = users.filter(item => {
      return parseInt(item.stravaId) !== parseInt(user.stravaId)
    })
    
    users.forEach(item => {
      const percentage = Math.round(item.elevationGain / 29030 * 100)
      let position = (this.state.everestDistance / 100) * percentage

      const g = this.state.svg.append("g")
        .attr('transform', "translate(0,0)")

      const userPointer = g.append("g")
        .data([position])
      
      const user = userPointer
        .append("path")
        .attr("class", styles.userTri)
        .attr('d', symbol().type(symbolTriangle).size(50)())

      const link = userPointer.append("svg:a")
        .attr("class", styles.photoLink)
        .attr("target", '_blank')
        .attr("xlink:href", `https://www.strava.com/athletes/${item.stravaId}`)

      const name = item.displayName.split(' ').reverse()

      name.forEach((nameItem, index) => {
        link.append("text")
          .attr('class', styles.displayName)
          .attr('data-lines', _.size(name))
          .attr('transform', `translate(0, -${16 + (index * 15)}) scale(.7)`)
          .attr('text-anchor', "middle")
          .text(nameItem)
      })

      const photo = link.append("svg:image")
        .attr("xlink:href", item.photo)
        .attr("class", styles.photo)

      userPointer
        .transition()
        .duration(0)
        .ease(easeExpOut)
        .attrTween("transform", (d) => {
          return this.translateAlong(d, this.state.path.node())()
        })
    })

    this.state.usersPlotted = true
  }

  translateAlong(d, path) {
    const l = path.getTotalLength() * d
    return (d, i, a) => {
        return (t) => {
            this.state.atLength = this.state.direction === 1 ? (t * l) : (l - (t * l))
            var p1 = path.getPointAtLength(this.state.atLength),
                p2 = path.getPointAtLength((this.state.atLength) + this.state.direction),
                angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI
            return "translate(" + p1.x + "," + p1.y + ")rotate(" + angle + ")"
        }
    }
  }

  translateCameraAlong(d, path) {
    const l = path.getTotalLength() * d
    return (d, i, a) => {
        return (t) => {
            this.state.cameraAtLength = this.state.direction === 1 ? (t * l) : (l - (t * l))
            var p1 = path.getPointAtLength(this.state.cameraAtLength),
                p2 = path.getPointAtLength((this.state.cameraAtLength) + this.state.direction),
                angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI

            const svgX = p1.x - (window.innerWidth / 2)
            let svgY = this.state.container.scrollHeight - p1.y - (window.innerHeight / 2)

            svgY = svgY < 0 ? 0 : svgY

            this.state.container.querySelector('svg').style.transform = "translate(-" + svgX + "px," + svgY + "px)"

            return "translate(" + p1.x + "," + p1.y + ")rotate(" + angle + ")"
        }
    }
  }

  init(percentage, percentageYearAgo, percentageQuarterAgo, feet, feetYearAgo, feetQuarterAgo) {
    if (!percentage && percentage != 0) return
    if (typeof window === 'undefined') return

    this.state.container = ReactDOM.findDOMNode(this.refs.container)

    var 
      width = 100000,
      height = window.screen.height * 10,

      x = scaleLinear()
        .domain([0, 1000])
        .range([10, width]),

      y = scaleLinear()
        .domain([0, 1])
        .range([height, 0]),

      data = range(x.domain()[1]).map(function (value = 0, index) {

        function getRandomArbitrary(min, max) {
          return Math.random() * (max - min) + min
        }

        return getRandomArbitrary(value + 1, value + 5) / 1000
      })

    data[0] = 0
    data[1000] = 0

    const theline = line()
      .curve(curveBasis)
      .x(function (d, i) {
        return x(i)
      })
      .y(y)

    this.state.svg = select(ReactDOM.findDOMNode(this.refs.chart))
      .append("svg")
      .attr('width', width)
      .attr('height', height)

    const g = this.state.svg.append("g")
    .attr('transform', "translate(0,0)")

    this.state.path = g.append("path")
      .datum(data)
      .attr('class', styles.line)
      .attr('ref', 'line')
      .attr('d', theline)

    const checkpoints = [
      { percentage: 50, 'name': '50% Everest'},
      { percentage: 100, 'name': 'Everest'}
    ]

    checkpoints.forEach(item => {
      let position = (this.state.everestDistance / 100) * item.percentage
      const checkpointPointer = g.append("g")
        .data([position])
      
      const checkpoint = checkpointPointer
        .append("path")
        .attr("class", styles.checkpoint)
        .attr('d', symbol().type(symbolTriangle).size(100)())
      
      const label = checkpointPointer.append("text")
          .attr('transform', "translate(0, -10)")
          .attr('class', styles.checkpointLabel)
          .attr('text-anchor', "middle")
          .text(item.name)

      checkpointPointer
        .transition()
        .duration(0)
        .ease(easeExpOut)
        .attrTween("transform", (d) => {
          return this.translateAlong(d, this.state.path.node())()
        })
    })

    let value = (this.state.everestDistance / 100) * percentage
    let valueYearAgo = (this.state.everestDistance / 100) * percentageYearAgo
    let valueQuarterAgo = (this.state.everestDistance / 100) * percentageQuarterAgo

    value = value > this.state.maxDistance ? this.state.maxDistance : value
    valueYearAgo = valueYearAgo > this.state.maxDistance ? this.state.maxDistance : valueYearAgo
    valueQuarterAgo = valueQuarterAgo > this.state.maxDistance ? this.state.maxDistance : valueQuarterAgo

    this.state.cameraData = value

    this.state.cameraPointer = g.append("g")
      .data([this.state.cameraData])

    this.state.pointer = g.append("g")
      .data([value])
      .data([this.state.cameraData])

    this.state.yearAgoPointer = g.append("g")
      .data([valueYearAgo])

    this.state.quarterAgoPointer = g.append("g")
      .data([valueQuarterAgo])

    const tri = this.state.pointer
      .append("path")
      .attr("class", styles.tri)
      .attr('d', symbol().type(symbolTriangle).size(100)())

    const triYearAgo = this.state.yearAgoPointer
      .append("path")
      .attr("class", styles.triYearAgo)
      .attr('d', symbol().type(symbolTriangle).size(50)())

    const yearAgoLabel = this.state.yearAgoPointer.append("text")
      .attr('class', styles.yearAgoLabel)
      .attr('text-anchor', "middle")
      .text('Year Ago')

    this.state.yearAgoLabelFeetLine = this.state.yearAgoPointer.append("text")
      .attr('class', styles.yearAgoLabelLine2)
      .attr('text-anchor', "middle")
      .text(`-${feet - feetYearAgo} FT`)

    const triQuarterAgo = this.state.quarterAgoPointer
      .append("path")
      .attr("class", styles.triQuarterAgo)
      .attr('d', symbol().type(symbolTriangle).size(50)())

    const quarterAgoLabel = this.state.quarterAgoPointer.append("text")
      .attr('class', styles.quarterAgoLabel)
      .attr('text-anchor', "middle")
      .text('¼ Year Ago')

    this.state.quarterAgoLabelFeetLine = this.state.quarterAgoPointer.append("text")
      .attr('class', styles.quarterAgoLabelLine2)
      .attr('text-anchor', "middle")
      .text(`-${feet - feetQuarterAgo} FT`)

    const camera = this.state.cameraPointer
      .append("path")
      .attr("class", styles.camera)
      .attr('d', symbol().type(symbolTriangle).size(100)())

    const transition = () => {
      this.state.direction *= -1
      this.state.pointer.transition()
        .duration(5000)
        .ease(easeExpOut)
        .attrTween("transform", (d) => {
            return this.translateAlong(d, this.state.path.node())()
        })

      if (percentageYearAgo > 0) {
        this.state.yearAgoPointer.transition()
          .duration(0)
          .ease(easeExpOut)
          .attrTween("transform", (d) => {
              return this.translateAlong(d, this.state.path.node())()
          })
      }

      if (percentageQuarterAgo > 0) {
        this.state.quarterAgoPointer.transition()
          .duration(0)
          .ease(easeExpOut)
          .attrTween("transform", (d) => {
              return this.translateAlong(d, this.state.path.node())()
          })
      }

        this.state.cameraPointer
        .transition()
        .duration(5000)
        .ease(easeExpOut)
        .attrTween("transform", (d) => {
          return this.translateCameraAlong(d, this.state.path.node())()
        })
      
      document.addEventListener("wheel", (e) => {
        const data = this.state.cameraData += (e.deltaX / 100000)
        if (data > this.state.maxDistance) return
        this.state.cameraPointer = this.state.cameraPointer.data([data])
        this.state.cameraData = this.state.cameraData < 0 ? 0 : this.state.cameraData
        this.state.cameraPointer
          .transition()
          .duration(0)
          .attrTween("transform", (d) => {
            return this.translateCameraAlong(d, this.state.path.node())()
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
            return this.translateCameraAlong(d, this.state.path.node())()
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
