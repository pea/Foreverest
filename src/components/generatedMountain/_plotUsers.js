import { easeExpOut, symbol, symbolTriangle } from 'd3'

import _ from 'underscore'
import styles from 'components/generatedMountain/style.scss'
import translateAlong from './_translateAlong'

/**
 * Plut users
 * Takes an array of user, removes the current user, plots 
 * them out and returns an update to the state
 *
 * @param array users Array of users to plot
 * @param object user User to filter out (current user)
 * @param object state State of index.js
 * @return object Update to the state in index.js
 */
export default (users, user, state) => {
  if (user.stravaId <= 0) return
  if (_.size(users) === 0) return
  if (state.usersPlotted) return

  users = users.filter(item => {
    return parseInt(item.stravaId) !== parseInt(user.stravaId)
  })

  users.forEach(item => {
    const percentage = Math.round(item.elevationGain / 29030 * 100)
    let position = (state.everestDistance / 100) * percentage

    const g = state.svg.append('g')
      .attr('transform', 'translate(0,0)')

    const userPointer = g.append('g')
      .data([position])

    userPointer
      .append('path')
      .attr('class', styles.userTri)
      .attr('d', symbol().type(symbolTriangle).size(50)())

    const link = userPointer.append('svg:a')
      .attr('class', styles.photoLink)
      .attr('target', '_blank')
      .attr('xlink:href', `https://www.strava.com/athletes/${item.stravaId}`)

    const name = item.displayName.split(' ').reverse()

    name.forEach((nameItem, index) => {
      link.append('text')
        .attr('class', styles.displayName)
        .attr('data-lines', _.size(name))
        .attr('transform', `translate(0, -${16 + (index * 15)}) scale(.7)`)
        .attr('text-anchor', 'middle')
        .text(nameItem)
    })

    link.append('svg:image')
      .attr('xlink:href', item.photo)
      .attr('class', styles.photo)

    userPointer
      .transition()
      .duration(0)
      .ease(easeExpOut)
      .attrTween("transform", (d) => {
        return translateAlong(d, state.path.node(), state)()
      })
  })

  return {usersPlotted: true}
}
