import { curveBasis, line, range, scaleLinear, select } from 'd3'

import ReactDOM from 'react-dom'
import styles from 'components/generatedMountain/style.scss'

export default (state, chart) => {
  const width = 100000
  const height = window.screen.height * 10

  const x = scaleLinear()
    .domain([0, 1000])
    .range([10, width])

  const y = scaleLinear()
    .domain([0, 1])
    .range([height, 0])

  const data = range(x.domain()[1]).map(function (value = 0, index) {
    function getRandomArbitrary (min, max) {
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

  const svg = select(ReactDOM.findDOMNode(chart))
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const g = svg.append('g')
    .attr('transform', 'translate(0,0)')

  const path = g.append('path')
    .datum(data)
    .attr('class', styles.line)
    .attr('ref', 'line')
    .attr('d', theline)

  return { svg, path }
}
