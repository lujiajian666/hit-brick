function collectDraw (ctx, width, height) {
  return function drawAll (drawList) {
    ctx.clearRect(0, 0, width, height)
    drawList.forEach(({ handle, param }) => handle({ ...param, width, height, ctx }))
    window.requestIdleCallback(drawAll.bind(null, drawList))
  }
}
function startDrawCircle ({ ctx, height, width, point, rectPoint }) {
  const stepLength = 5
  ctx.beginPath()
  ctx.fillStyle = 'white'
  const targetX = point.x + point.xDirect * stepLength
  if (targetX > width || targetX < 0 || intersect(rectPoint, point)) {
    point.xDirect *= -1
  }
  point.x = point.x + point.xDirect * stepLength
  const targetY = point.y + point.yDirect * stepLength
  if (targetY > height || targetY < 0 || intersect(rectPoint, point)) {
    point.yDirect *= -1
  }
  point.y = point.y + point.yDirect * stepLength

  ctx.arc(point.x, point.y, point.r, 0, 2 * Math.PI)
  ctx.fill()
}

function startDrawRect ({ ctx, width, point }) {
  const stepLength = point.stepLength--
  if (stepLength <= 0) point.stepLength = 0
  ctx.beginPath()
  ctx.fillStyle = 'red'
  const targetX = point.x + point.xDirect * stepLength
  if (targetX > width - point.width || targetX < 0) {
    point.xDirect = 0
    // point.xDirect *= -1
  }
  point.x = point.x + point.xDirect * stepLength
  ctx.rect(point.x, point.y, point.width, point.height)
  ctx.fill()
}

function intersect (rect, circle) {
  const targetPoint = {}
  if (circle.x > rect.x + rect.width) {
    targetPoint.x = rect.x + rect.width
  } else if (circle.x < rect.x) {
    targetPoint.x = rect.x
  } else {
    targetPoint.x = circle.x
  }

  if (circle.y > rect.y + rect.height) {
    targetPoint.y = rect.y + rect.height
  } else if (circle.y < rect.y) {
    targetPoint.y = rect.y
  } else {
    targetPoint.y = circle.y
  }

  return Math.sqrt(Math.pow(targetPoint.x - circle.x, 2) + Math.pow(targetPoint.y - circle.y, 2)) < circle.r
}

export { startDrawCircle, collectDraw, startDrawRect }
