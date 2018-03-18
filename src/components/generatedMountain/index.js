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
    this.init(this.props.percentage)    
  }

  componentDidMount() {
    this.props.dispatch(loadApp())
    this.init(this.props.percentage)    
  }

  props: Props

  componentWillReceiveProps(nextProps) {
    if (nextProps.percentage !== this.props.percentage) {
      this.init(nextProps.percentage)
    }
  }

  init(percentage) {
    if (typeof percentage === 'undefined') return

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

    const path = g.append("path")
      .datum(data)
      .attr('class', styles.line)
      .attr('ref', 'line')
      .attr('d', theline)

    let value = percentage / 100 * 2 / 100

    // scrollToWithAnimation(
    //   ReactDOM.findDOMNode(this.refs.container),
    //   'scrollLeft',
    //   50000 / 4500 * percentage - (window.screen.width / 2),
    //   1000,
    //   'easeOutExpo'
    // )

    let cameraData = value

    let cameraPointer = g.append("g")
      .data([cameraData])

    let pointer = g.append("g")
      .data([value])

    // Disable for now
    // const label = pointer.append("text")
    //   .attr('transform', "translate(0, -10)")
    //   .text("Text")

    const tri = pointer
      .append("path")
      .attr("class", styles.tri)
      .attr('d', symbol().type(symbolTriangle).size(100)())

    const camera = cameraPointer
      .append("path")
      .attr("class", styles.camera)
      .attr('d', symbol().type(symbolTriangle).size(100)())

    let direction = -1,
        atLength

    function transition() {
      direction *= -1
      pointer.transition()
        .duration(3000)
        .ease(easeExpOut)
        .attrTween("transform", function (d) {
            return translateAlong(d, path.node())()
        })

      cameraPointer
        .transition()
        .duration(0)
        .attrTween("transform", function (d) {
          return translateCameraAlong(d, path.node())()
        })
      
      document.addEventListener("wheel", function (e) {
        cameraPointer = cameraPointer.data([cameraData += (e.deltaX / 100000)])
        cameraData = cameraData < 0 ? 0 : cameraData
        cameraPointer
          .transition()
          .duration(0)
          .attrTween("transform", function (d) {
            return translateCameraAlong(d, path.node())()
          })
      })

      new Hammer(container).on('panleft panright', function(e) {
        if (e.type === 'panleft') {
          cameraPointer = cameraPointer.data([cameraData += (e.distance/ 100000)])
        } else {
          cameraPointer = cameraPointer.data([cameraData -= (e.distance / 100000)])
        }
        cameraData = cameraData < 0 ? 0 : cameraData
        cameraPointer
          .transition()
          .duration(0)
          .attrTween('transform', function (d) {
            return translateCameraAlong(d, path.node())()
          }) 
      });
      
    }
  
    transition()

    ReactDOM.findDOMNode(this.refs.container).scrollTop = '99999'

    function translateAlong(d, path) {
        var l = path.getTotalLength() * d
        return function (d, i, a) {
            return function (t) {
                atLength = direction === 1 ? (t * l) : (l - (t * l))
                var p1 = path.getPointAtLength(atLength),
                    p2 = path.getPointAtLength((atLength) + direction),
                    angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI
                return "translate(" + p1.x + "," + p1.y + ")rotate(" + angle + ")"
            }
        }
    }

    function translateCameraAlong(d, path) {
        var l = path.getTotalLength() * d
        return function (d, i, a) {
            return function (t) {
                atLength = direction === 1 ? (t * l) : (l - (t * l))
                var p1 = path.getPointAtLength(atLength),
                    p2 = path.getPointAtLength((atLength) + direction),
                    angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI

                const svgX = p1.x - (window.innerWidth / 2)
                let svgY = container.scrollHeight - p1.y - (window.innerHeight / 2)

                svgY = svgY < 0 ? 0 : svgY

                container.querySelector('svg').style.transform = "translate(-" + svgX + "px," + svgY + "px)"

                return "translate(" + p1.x + "," + p1.y + ")rotate(" + angle + ")"
            }
        }
    }
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
