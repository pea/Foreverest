export default (d, path, state) => {
  const l = path.getTotalLength() * d
  return (d, i, a) => {
    return (t) => {
      const cameraAtLength = state.direction === 1 ? (t * l) : (l - (t * l))
      const p1 = path.getPointAtLength(cameraAtLength)
      const p2 = path.getPointAtLength((cameraAtLength) + state.direction)
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI
      const svgX = p1.x - (window.innerWidth / 2)
      let svgY = state.container.scrollHeight - p1.y - (window.innerHeight / 2)
      svgY = svgY < 0 ? 0 : svgY
      state.container.querySelector('svg').style.transform = `translate(-${svgX}px, ${svgY}px)`
      return `translate(${p1.x}, ${p1.y}) rotate(${angle})`
    }
  }
}
