
function remove (drawList, id) {
  const index = drawList.findIndex((item) => item.id === id)
  drawList.splice(index, 1)
}
function collectDraw (ctx, width, height) {
  return function drawAll (drawList) {
    ctx.clearRect(0, 0, width, height)
    drawList.forEach(({ handle, param, id }) => handle({
      ...param,
      width,
      height,
      ctx,
      remove: remove.bind(null, drawList, id)
    }))
    window.requestIdleCallback(drawAll.bind(null, drawList))
  }
}
function startDrawCircle ({ ctx, height, width, point, rectPoint, remove }) {
  const stepLength = 5
  ctx.beginPath()
  ctx.fillStyle = 'white'

  const targetY = point.y + point.yDirect * stepLength
  if (targetY > height) {
    remove()
    return
  }
  if (targetY < 0 || intersect(rectPoint, point)) {
    point.yDirect *= -1
  }
  point.y = point.y + point.yDirect * stepLength

  const targetX = point.x + point.xDirect * stepLength
  if (targetX > width || targetX < 0 || intersect(rectPoint, point)) {
    point.xDirect *= -1
  }
  point.x = point.x + point.xDirect * stepLength

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

// 不能卡在中间，最上边以下的，不算触碰
function intersect (rect, circle) {
  const targetPoint = {}

  if (circle.y <= rect.y - circle.r) {
    targetPoint.y = rect.y
  } else {
    return false
  }

  if (circle.x > rect.x + rect.width) {
    targetPoint.x = rect.x + rect.width
  } else if (circle.x < rect.x) {
    targetPoint.x = rect.x
  } else {
    targetPoint.x = circle.x
  }
  return Math.sqrt(Math.pow(targetPoint.x - circle.x, 2) + Math.pow(targetPoint.y - circle.y, 2)) <= circle.r
}

export { startDrawCircle, collectDraw, startDrawRect }
