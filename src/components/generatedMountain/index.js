import React, { Component } from 'react'
import { curveBasis, d3, easeExpOut, easeLinear, line, range, scaleLinear, select, symbol, symbolTriangle } from 'd3'

import Hammer from 'hammerjs'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { loadApp } from 'actions/app'
import scrollToWithAnimation from 'scrollto-with-animation'
import styles from 'components/generatedMountain/style.scss'

type Props = {
  dispatch: () => void,
  loaded: boolean,
  percentage: string
}

export class GeneratedMountain extends Component {
  constructor(props){
    super(props)
    this.state = {
      pointer: {},
      cameraPointer: {},
      path: {},
      direction: -1,
      atLength: 0
    }
  }

  componentDidMount() {
    this.props.dispatch(loadApp())
    this.init(this.props.percentage)    
  }

  props: Props

  componentWillReceiveProps(nextProps) {
    if (nextProps.percentage !== this.props.percentage) {
      this.update(nextProps.percentage)
    }
  }

  update(percentage) {
    const value = percentage / 100 * 4 / 100
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
    const container = ReactDOM.findDOMNode(this.refs.container)
    return (d, i, a) => {
        return (t) => {
            this.state.atLength = this.state.direction === 1 ? (t * l) : (l - (t * l))
            var p1 = path.getPointAtLength(this.state.atLength),
                p2 = path.getPointAtLength((this.state.atLength) + this.state.direction),
                angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI

            const svgX = p1.x - (window.innerWidth / 2)
            let svgY = container.scrollHeight - p1.y - (window.innerHeight / 2)

            svgY = svgY < 0 ? 0 : svgY

            container.querySelector('svg').style.transform = "translate(-" + svgX + "px," + svgY + "px)"

            return "translate(" + p1.x + "," + p1.y + ")rotate(" + angle + ")"
        }
    }
  }

  init(percentage) {
    if (typeof percentage === 'undefined') return
    if (typeof window === 'undefined') return

    const container = ReactDOM.findDOMNode(this.refs.container)

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

    const svg = select(ReactDOM.findDOMNode(this.refs.chart))
      .append("svg")
      .attr('width', width)
      .attr('height', height)


    const g = svg.append("g")
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
      let position = item.percentage / 100 * 4 / 100
      const checkpointPointer = g.append("g")
        .data([position])
      
      const checkpoint = checkpointPointer
        .append("path")
        .attr("class", styles.checkpoint)
        .attr('d', symbol().type(symbolTriangle).size(100)())
      
      const label = checkpointPointer.append("text")
          .attr('transform', "translate(0, -10)")
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

    let value = percentage / 100 * 4 / 100

    let cameraData = value

    this.state.cameraPointer = g.append("g")
      .data([cameraData])

    this.state.pointer = g.append("g")
      .data([value])

    const tri = this.state.pointer
      .append("path")
      .attr("class", styles.tri)
      .attr('d', symbol().type(symbolTriangle).size(100)())

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

        this.state.cameraPointer
        .transition()
        .duration(5000)
        .ease(easeExpOut)
        .attrTween("transform", (d) => {
          return this.translateCameraAlong(d, this.state.path.node())()
        })
      
      document.addEventListener("wheel", (e) => {
        this.state.cameraPointer = this.state.cameraPointer.data([cameraData += (e.deltaX / 100000)])
        cameraData = cameraData < 0 ? 0 : cameraData
        this.state.cameraPointer
          .transition()
          .duration(0)
          .attrTween("transform", (d) => {
            return this.translateCameraAlong(d, this.state.path.node())()
          })
      })

      new Hammer(container).on('panleft panright', function(e) {
        if (e.type === 'panleft') {
          this.state.cameraPointer = this.state.cameraPointer.data([cameraData += (e.distance/ 100000)])
        } else {
          this.state.cameraPointer = this.state.cameraPointer.data([cameraData -= (e.distance / 100000)])
        }
        cameraData = cameraData < 0 ? 0 : cameraData
        this.state.cameraPointer
          .transition()
          .duration(0)
          .attrTween('transform', (d) => {
            return this.translateCameraAlong(d, this.state.path.node())()
          }) 
      });
      
    }
  
    transition()

    ReactDOM.findDOMNode(this.refs.container).scrollTop = '99999'
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
