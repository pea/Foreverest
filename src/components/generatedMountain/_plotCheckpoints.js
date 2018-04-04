import { easeExpOut, symbol, symbolTriangle } from 'd3'

import styles from 'components/generatedMountain/style.scss'
import translateAlong from './_translateAlong'

export default (state) => {
  const checkpoints = [
    { percentage: 50, name: '50% Everest' },
    { percentage: 100, name: 'Everest' }
  ]

  const g = state.svg.append('g')
    .attr('transform', 'translate(0,0)')

  checkpoints.forEach(item => {
    let position = (state.everestDistance / 100) * item.percentage

    const checkpointPointer = g.append('g')
      .data([position])

    checkpointPointer
      .append('path')
      .attr('class', styles.checkpoint)
      .attr('d', symbol().type(symbolTriangle).size(100)())

    checkpointPointer.append('text')
      .attr('transform', 'translate(0, -10)')
      .attr('class', styles.checkpointLabel)
      .attr('text-anchor', 'middle')
      .text(item.name)

    state.direction *= -1
    checkpointPointer
      .transition()
      .duration(0)
      .ease(easeExpOut)
      .attrTween('transform', (d) => {
        return translateAlong(d, state.path.node(), state)()
      })
  })
}
