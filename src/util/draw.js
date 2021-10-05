function collectDraw (ctx, width, height) {
  return function drawAll (drawList) {
    ctx.clearRect(0, 0, width, height)
    drawList.forEach(({ handle, param }) => handle({ ...param, width, height, ctx }))
    window.requestIdleCallback(drawAll.bind(null, drawList))
  }
}
function startDrawCircle ({ ctx, height, width, point }) {
  const stepLength = 5
  ctx.beginPath()
  ctx.fillStyle = 'white'
  const targetX = point.x + point.xDirect * stepLength
  if (targetX > width || targetX < 0) {
    point.xDirect *= -1
  }
  point.x = point.x + point.xDirect * stepLength
  const targetY = point.y + point.yDirect * stepLength
  if (targetY > height || targetY < 0) {
    point.yDirect *= -1
  }
  point.y = point.y + point.yDirect * stepLength

  ctx.arc(point.x, point.y, point.r, 0, 2 * Math.PI)
  ctx.fill()
}

function startDrawRect ({ ctx, width, point }) {
  const stepLength = 10
  ctx.beginPath()
  ctx.fillStyle = 'red'
  const targetX = point.x + point.xDirect * stepLength
  if (targetX > width - 100 || targetX < 0) {
    // point.xDirect = 0
    point.xDirect *= -1
  }
  point.x = point.x + point.xDirect * stepLength
  ctx.rect(point.x, point.y, 100, 8)
  ctx.fill()
}

export { startDrawCircle, collectDraw, startDrawRect }
