export default (d, path, state) => {
  const l = path.getTotalLength() * d
  return (d, i, a) => {
    return (t) => {
      const atLength = state.direction === 1 ? (t * l) : (l - (t * l))
      const p1 = path.getPointAtLength(atLength)
      const p2 = path.getPointAtLength((atLength) + state.direction)
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI
      return 'translate(' + p1.x + ',' + p1.y + ')rotate(' + angle + ')'
    }
  }
}
