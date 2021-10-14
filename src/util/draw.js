
let count = 0
const BRICK_HEIGHT = 10
const BRICK_WIDTH = 10
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

    if (drawMap.brick.param.brickList.length === drawMap.brick.param.brickListAvailable) {
      callBack('胜利')
    } else {
      if (drawMap.circle.param.circleList.length > 0) {
        callBack('')
        drawMap.circle.handle({
          ...drawMap.circle.param,
          ...commonParam
        })
      } else {
        callBack('发球开始游戏')
      }
    }
    _count === count && window.requestIdleCallback(drawAll.bind(null, drawMap))
  }
}

function drawRacket ({ ctx, screenWidth, racket }) {
  const stepLength = racket.stepLength--
  if (stepLength <= 0) racket.stepLength = 0
  ctx.beginPath()
  ctx.fillStyle = 'red'
  const targetX = racket.x + racket.xVerctor * stepLength
  if (targetX > screenWidth - racket.width || targetX < 0) {
    racket.xVerctor = 0
    // point.xVerctor *= -1
  }
  racket.x = racket.x + racket.xVerctor * stepLength
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
function drawSingleCircle ({ ctx, screenHeight, screenWidth, circle, racket, remove, brickClassifyMap }) {
  const stepLength = 5
  ctx.beginPath()
  ctx.fillStyle = 'white'

  const targetY = circle.y + circle.yDirect * stepLength
  const targetX = circle.x + circle.xDirect * stepLength
  const isIntersect = arroundIntersectDetect(
    brickClassifyMap,
    racket,
    { x: targetX, y: targetY, r: circle.r }
  )

  if (targetY > screenHeight) {
    remove()
    return
  }
  if (targetY < 0) {
    circle.yDirect *= -1
  }
  if (targetX > screenWidth || targetX < 0) {
    circle.xDirect *= -1
  }
  if (isIntersect.hasIntersect) {
    if (isIntersect.y) {
      circle.yDirect *= -1
    }
    if (isIntersect.x) {
      circle.xDirect *= -1
    }
    if (isIntersect.xDirect) {
      // 赋予水平方向的速度
      // circle.xDirect += racket.xDirect * racket.stepLength / racket.maxStepLength
      circle.xDirect += isIntersect.xDirect
      if (Math.abs(circle.xDirect) > 2) {
        circle.xDirect = circle.xDirect > 0 ? 1.5 : -1.5
      }
    }
  }
  circle.y = circle.y + circle.yDirect * stepLength
  circle.x = circle.x + circle.xDirect * stepLength

  ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI)
  ctx.fill()
}

function drawBricks ({ ctx, brickList }) {
  brickList.forEach((brick) => {
    if (!brick.show) return
    drawSingleBrick(ctx, {
      ...brick,
      height: BRICK_HEIGHT,
      width: BRICK_WIDTH
    })
  })
}
function drawSingleBrick (ctx, brick) {
  ctx.beginPath()
  ctx.fillStyle = brick.indestructible ? '#666' : 'green'
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 1
  ctx.rect(brick.x, brick.y, brick.width, brick.height)
  ctx.fill()
  ctx.stroke()
}

function tryRemoveBrick (brick) {
  if (brick.indestructible) return
  brick.show = false
}
// 查看球上下左右有没有东西触碰
function arroundIntersectDetect (brickClassifyMap, racket, circle) {
  const detectRes = {
    hasIntersect: false
  }
  // 找出小球附近的所有砖块
  const arroundBricks = findArroundBricks(circle)
  // 找出第一块碰撞的砖块，获取其碰撞面，碰撞x速度等信息
  arroundBricks.some((brick) => {
    if (brickClassifyMap[brick.x] && brickClassifyMap[brick.x][brick.y]) {
      const intersectRes = checkIntersect(brickClassifyMap[brick.x][brick.y], circle)
      if (intersectRes.hasIntersect) {
        Object.assign(detectRes, intersectRes)
        // 碰撞后不显示砖块
        tryRemoveBrick(brickClassifyMap[brick.x][brick.y])
        return true
      }
    }
    return false
  })
  if (!detectRes.hasIntersect) {
    const hasIntersectWithRacket = checkIntersect(racket, circle, true)
    if (hasIntersectWithRacket.hasIntersect) {
      Object.assign(detectRes, hasIntersectWithRacket)
    }
  }
  return detectRes
}
// 触碰检测。
// 不能卡在球拍中间，最上边以下的，不算触碰
function checkIntersect (rect, circle, isRacket = false) {
  const targetPoint = {}

  if (isRacket) {
    if (circle.y <= rect.y - circle.r) {
      targetPoint.y = rect.y
    } else {
      return {
        hasIntersect: false,
        y: false,
        x: false,
        xDirect: 0
      }
    }
  } else {
    if (circle.y > rect.y + rect.height) {
      targetPoint.y = rect.y + rect.height
    } else if (circle.y < rect.y) {
      targetPoint.y = rect.y
    } else {
      targetPoint.y = circle.y
    }
  }

  if (circle.x > rect.x + rect.width) {
    targetPoint.x = rect.x + rect.width
  } else if (circle.x < rect.x) {
    targetPoint.x = rect.x
  } else {
    targetPoint.x = circle.x
  }

  return calcIntersectInfo({ targetPoint, circle, isRacket, rect })
}
function calcIntersectInfo ({ targetPoint, circle, isRacket, rect }) {
  const res = {
    hasIntersect: false,
    y: false,
    x: false,
    xDirect: 0
  }
  const hasIntersect = Math.sqrt(Math.pow(targetPoint.x - circle.x, 2) + Math.pow(targetPoint.y - circle.y, 2)) <= circle.r
  if (hasIntersect) {
    if (isRacket) {
      return {
        hasIntersect: true,
        y: true,
        xDirect: rect.stepLength / rect.maxStepLength * rect.xVerctor
      }
    }
    const rectCenterPoint = { x: rect.x + BRICK_WIDTH / 2, y: rect.y + BRICK_HEIGHT / 2 }
    const angle = getRadian(circle, { x: 1, y: 0 }, rectCenterPoint)
    const isIntersectY = angle > Math.PI / 4 && angle < 1.25 * Math.PI
    Object.assign(res, {
      hasIntersect: true,
      y: isIntersectY,
      x: !isIntersectY
    })
  }
  return res
}
function findArroundBricks (circle) {
  const top = circle.y - circle.r
  const bottom = circle.y + circle.r
  const left = circle.x - circle.r
  const right = circle.x + circle.r
  const startBrickY = top - top % BRICK_HEIGHT
  const endBrickY = bottom - bottom % BRICK_HEIGHT
  const startBrickX = left - left % BRICK_WIDTH
  const endBrickX = right - right % BRICK_WIDTH
  const res = []
  for (let x = startBrickX; x <= endBrickX; x += BRICK_WIDTH) {
    for (let y = startBrickY; y <= endBrickY; y += BRICK_HEIGHT) {
      res.push({
        x,
        y,
        height: BRICK_HEIGHT,
        width: BRICK_WIDTH
      })
    }
  }
  return res
}
function getRadian (point1, point2, pointCenter) {
  // 夹角
  const vector1 = {
    x: point1.x - pointCenter.x,
    y: point1.y - pointCenter.y
  }
  const vector2 = {
    x: point2.x - pointCenter.x,
    y: point2.y - pointCenter.y
  }
  // 向量的乘积
  const productValue = (vector1.x * vector2.x) + (vector1.y * vector2.y)
  // 向量1的模
  const vector1Value = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y)
  // 向量2的模
  const vector2Value = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y)
  // 余弦公式
  const cosValue = productValue / (vector1Value * vector2Value)
  // acos返回的是弧度值，转换为角度值
  return Math.acos(cosValue)
}

export { drawCircles, collectDraw, drawRacket, drawBricks }
