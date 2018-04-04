import { easeExpOut, symbol, symbolTriangle } from 'd3'

import styles from 'components/generatedMountain/style.scss'
import translateAlong from './_translateAlong'

export default (state, distance) => {
  const g = state.svg.append('g')
    .attr('transform', 'translate(0,0)')

  const pointer = g.append('g')
    .data([distance])

  pointer
    .append('path')
    .attr('class', styles.tri)
    .attr('d', symbol().type(symbolTriangle).size(100)())

  pointer.transition()
    .duration(5000)
    .ease(easeExpOut)
    .attrTween('transform', (d) => {
      return translateAlong(d, state.path.node(), state)()
    })

  return {
    pointer
  }
}
