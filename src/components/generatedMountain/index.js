import React, { Component } from 'react'
import { curveBasis, d3, easeExpOut, easeLinear, line, range, scaleLinear, select, symbol, symbolTriangle } from 'd3'

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
    
    var margin = { top: 0, right: 0, bottom: 0, left: 0 },
      width = 50000 - margin.left - margin.right,
      height = window.screen.height - 66 - margin.top - margin.bottom,

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

        return getRandomArbitrary(value + 1, value + 5) / 100
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
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)


    const g = svg.append("g")
      .attr('transform', "translate(" + margin.left + "," + margin.top + ")")

    const path = g.append("path")
      .datum(data)
      .attr('class', styles.line)
      .attr('d', theline)

    const value = percentage / 100 * 2 / 100

    scrollToWithAnimation(
      ReactDOM.findDOMNode(this.refs.container),
      'scrollLeft',
      50000 / 4500 * percentage - (window.screen.width / 2),
      1000,
      'easeOutExpo'
    )

    const pointer = g.append("g")
      .data([value])

    // Disable for now
    // const label = pointer.append("text")
    //   .attr('transform', "translate(0, -10)")
    //   .text("Text")

    const tri = pointer
      .append("path")
      .attr("class", styles.tri)
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
    }

    transition()

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
