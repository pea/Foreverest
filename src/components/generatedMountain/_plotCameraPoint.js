import { easeExpOut, symbol, symbolTriangle } from 'd3'

import Hammer from 'hammerjs'
import styles from 'components/generatedMountain/style.scss'
import translateCameraAlong from './_translateCameraAlong'

export default (state, distance) => {
  let cameraData = 0
  const g = state.svg.append('g')
    .attr('transform', 'translate(0,0)')

  cameraData = distance

  let cameraPointer = g.append('g')
    .data([cameraData])

  cameraPointer
    .append('path')
    .attr('class', styles.camera)
    .attr('d', symbol().type(symbolTriangle).size(100)())

  cameraPointer
    .transition()
    .duration(5000)
    .ease(easeExpOut)
    .attrTween('transform', (d) => {
      return translateCameraAlong(d, state.path.node(), state)()
    })

  document.addEventListener('wheel', (e) => {
    const data = cameraData += (e.deltaX / 100000)
    if (data > state.maxDistance) return
    cameraPointer = cameraPointer.data([data])
    cameraData = cameraData < 0 ? 0 : cameraData
    cameraPointer
      .transition()
      .duration(0)
      .attrTween('transform', (d) => {
        return translateCameraAlong(d, state.path.node(), state)()
      })
  })

  new Hammer(state.container).on('panleft panright', (e) => {
    let distance = e.distance > 50 ? 50 : e.distance
    if (e.type === 'panleft') {
      let pranLeftData = this.cameraData += (distance / 100000)
      if (pranLeftData > state.maxDistance) return
      this.cameraPointer = this.cameraPointer.data([pranLeftData])
    } else {
      this.cameraPointer = this.cameraPointer.data([this.cameraData -= (distance / 100000)])
    }
    this.cameraData = this.cameraData < 0 ? 0 : this.cameraData
    this.cameraPointer
      .transition()
      .duration(0)
      .attrTween('transform', (d) => {
        return translateCameraAlong(d, state.path.node(), state)()
      })
  })

  return {
    cameraPointer
  }
}
