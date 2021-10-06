
let count = 0
function collectDraw (ctx, screenHeight, screenWidth, callBack) {
  count++
  const _count = count
  return function drawAll (drawMap) {
    ctx.clearRect(0, 0, screenWidth, screenHeight)
    const commonParam = {
      screenWidth,
      screenHeight,
      ctx
    }
    drawMap.brick.handle({
      ...drawMap.brick.param,
      ...commonParam
    })
    drawMap.racket.handle({
      ...drawMap.racket.param,
      ...commonParam
    })
    if (drawMap.circle.param.circleList.length > 0) {
      callBack('start')
      drawMap.circle.handle({
        ...drawMap.circle.param,
        ...commonParam
      })
    } else {
      callBack('end')
    }
    _count === count && window.requestIdleCallback(drawAll.bind(null, drawMap))
  }
}

function drawRacket ({ ctx, screenWidth, racket }) {
  const stepLength = racket.stepLength--
  if (stepLength <= 0) racket.stepLength = 0
  ctx.beginPath()
  ctx.fillStyle = 'red'
  const targetX = racket.x + racket.xDirect * stepLength
  if (targetX > screenWidth - racket.width || targetX < 0) {
    racket.xDirect = 0
    // point.xDirect *= -1
  }
  racket.x = racket.x + racket.xDirect * stepLength
  ctx.rect(racket.x, racket.y, racket.width, racket.height)
  ctx.fill()
}

function drawCircles (params) {
  const { circleList, racket, ...other } = params
  circleList.forEach((circle) => {
    drawSingleCircle({
      ...other,
      circle,
      racket,
      remove () {
        const index = circleList.findIndex((item) => item.id === circle.id)
        circleList.splice(index, 1)
      }
    })
  })
}
function drawSingleCircle ({ ctx, screenHeight, screenWidth, circle, racket, remove }) {
  const stepLength = 5
  ctx.beginPath()
  ctx.fillStyle = 'white'

  const targetY = circle.y + circle.yDirect * stepLength
  const targetX = circle.x + circle.xDirect * stepLength
  const isIntersect = intersect(racket, { x: targetX, y: targetY, r: circle.r })

  if (targetY > screenHeight) {
    remove()
    return
  }
  if (targetY < 0 || isIntersect) {
    circle.yDirect *= -1
  }
  if (targetX > screenWidth || targetX < 0) {
    circle.xDirect *= -1
  }
  if (isIntersect) {
    // 赋予水平方向的速度
    circle.xDirect += racket.xDirect * racket.stepLength / racket.maxStepLength
    if (Math.abs(circle.xDirect) > 2) {
      circle.xDirect = circle.xDirect > 0 ? 1.5 : -1.5
    }
  }
  circle.y = circle.y + circle.yDirect * stepLength
  circle.x = circle.x + circle.xDirect * stepLength

  ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI)
  ctx.fill()
}

function drawBricks ({ ctx, brickList }) {
  brickList.forEach((brick) => {
    drawSingleBrick(ctx, {
      ...brick,
      height: 10,
      width: 20
    })
  })
}
function drawSingleBrick (ctx, brick) {
  ctx.beginPath()
  ctx.fillStyle = brick.indestructible ? '#999' : 'white'
  ctx.rect(brick.x, brick.y, brick.width, brick.height)
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

export { drawCircles, collectDraw, drawRacket, drawBricks }
