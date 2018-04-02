import { easeExpOut, symbol, symbolTriangle } from 'd3'

import styles from 'components/generatedMountain/style.scss'
import translateAlong from './_translateAlong'

/**
 * Initiate and plot time ago points
 *
 * @param array timeAgos [ { percentage: <percentage along>, feet: <feet of point>, text: <label text>} ]
 * @param object state State of index.js
 * @param float feet Feet of current user
 * @return object Update to the state in index.js
 */
export function init (timeAgos, state, feet) {
  timeAgos.forEach((item, index) => {
    let distance = (state.everestDistance / 100) * item.percentage
    timeAgos[index].distance = distance > state.maxDistance ? state.maxDistance : distance

    const g = state.svg.append('g')
      .attr('transform', 'translate(0,0)')

    timeAgos[index].pointer = g.append('g')
      .data([timeAgos[index].distance])

    timeAgos[index].pointer
      .append('path')
      .attr('class', styles.triTimeAgo)
      .attr('d', symbol().type(symbolTriangle).size(50)())

    timeAgos[index].pointer.append('text')
      .attr('class', styles.timeAgoLabel)
      .attr('text-anchor', 'middle')
      .text(item.text)

    timeAgos[index].feetLabel = timeAgos[index].pointer.append('text')
      .attr('class', styles.timeAgoLabelLine2)
      .attr('text-anchor', 'middle')
      .text(`-${feet - item.feet} FT`)

    timeAgos[index].pointer.transition()
      .duration(0)
      .ease(easeExpOut)
      .attrTween('transform', (d) => {
        return translateAlong(d, state.path.node(), state)()
      })
  })
  return { timeAgos }
}

/**
 * Update time ago points
 *
 * @param array timeAgos [ { percentage: <percentage along>, feet: <feet of point>, text: <label text>} ]
 * @param object state State of index.js
 * @param float feet Feet of current user
 * @return object Update to the state in index.js
 */
export function update (timeAgos, state, feet) {
  timeAgos.forEach((item, index) => {
    timeAgos[index].distance = (state.everestDistance / 100) * item.percentage

    item.pointer
      .data([timeAgos[index].distance])
      .transition()
      .duration(0)
      .ease(easeExpOut)
      .attrTween('transform', (d) => {
        return translateAlong(d, state.path.node(), state)()
      })

    timeAgos[index].feetLabel
      .text(`-${feet - item.feet} FT`)
  })
  return { timeAgos }
}

export default {
  init,
  update
}
