
function remove (drawList, id) {
  const index = drawList.findIndex((item) => item.id === id)
  drawList.splice(index, 1)
}
let count = 0
function collectDraw (ctx, width, height, callBack) {
  count++
  const _count = count
  return function drawAll (drawList) {
    ctx.clearRect(0, 0, width, height)
    if (drawList.length <= 1) {
      callBack('end')
    } else {
      callBack('start')
    }
    drawList.forEach(({ handle, param, id }) => handle({
      ...param,
      width,
      height,
      ctx,
      remove: remove.bind(null, drawList, id)
    }))
    _count === count && window.requestIdleCallback(drawAll.bind(null, drawList))
  }
}
function drawCircle ({ ctx, height, width, point, rectPoint, remove }) {
  const stepLength = 5
  ctx.beginPath()
  ctx.fillStyle = 'white'

  const targetY = point.y + point.yDirect * stepLength
  const targetX = point.x + point.xDirect * stepLength
  const isIntersect = intersect(rectPoint, { x: targetX, y: targetY, r: point.r })

  if (targetY > height) {
    remove()
    return
  }
  if (targetY < 0 || isIntersect) {
    point.yDirect *= -1
  }
  if (targetX > width || targetX < 0) {
    point.xDirect *= -1
  }
  if (isIntersect) {
    // 赋予水平方向的速度
    point.xDirect += rectPoint.xDirect * rectPoint.stepLength / rectPoint.maxStepLength
    if (Math.abs(point.xDirect) > 2) {
      point.xDirect = point.xDirect > 0 ? 1.5 : -1.5
    }
  }
  point.y = point.y + point.yDirect * stepLength
  point.x = point.x + point.xDirect * stepLength

  ctx.arc(point.x, point.y, point.r, 0, 2 * Math.PI)
  ctx.fill()
}

function drawRacket ({ ctx, width, point }) {
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

export { drawCircle, collectDraw, drawRacket }
