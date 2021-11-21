
import { addEvent, emitEvent } from './event'
import globalVarible from './globalVariable'
import { BRICK_HEIGHT, BRICK_WIDTH } from './levelInfo'

function collectDraw (ctx, screenHeight, screenWidth, callBack) {
  globalVarible.count++
  const _count = globalVarible.count
  return function drawAll (drawMap, pause) {
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
    drawMap.prop.handle({
      ...drawMap.prop.param,
      ...commonParam
    })
    if (globalVarible.hasStart && drawMap.brick.param.brickListShowCount === drawMap.brick.param.brickListIndestructible) {
      callBack('胜利')
    } else {
      if (drawMap.circle.param.circleList.length > 0) {
        globalVarible.hasStart = true
        callBack('')
        drawMap.circle.handle({
          ...drawMap.circle.param,
          ...commonParam
        })
      } else {
        callBack('发球开始游戏')
      }
    }
    _count === globalVarible.count && !pause && window.requestIdleCallback(drawAll.bind(null, drawMap, pause))
    addEvent('split', function () {
      setTimeout(() => {
        const currentList = drawMap.circle.param.circleList
        if (currentList.length >= 40) return
        const appendList = []
        currentList.forEach((circle) => {
          const [v1, v2] = division({ x: circle.xSpeed, y: circle.ySpeed })
          appendList.push({ ...circle, ...v1, id: ++window.id })
          appendList.push({ ...circle, ...v2, id: ++window.id })
        })
        currentList.push(...appendList)
      })
    })
    addEvent('removeBrick', function (brick) {
      if (brick.indestructible) return
      brick.show = false
      drawMap.brick.param.brickListShowCount--
    })
  }
}

function drawRacket ({ ctx, screenWidth, racket }) {
  const stepLength = racket.stepLength--
  if (stepLength <= 0) racket.stepLength = 0
  ctx.beginPath()
  ctx.fillStyle = 'red'
  const targetX = racket.x + racket.xVerctor * stepLength
  const rightBounds = screenWidth - racket.width
  const leftBounds = 0
  if (targetX > rightBounds || targetX < leftBounds) {
    racket.xVerctor = 0
    // point.xVerctor *= -1
  }
  racket.x = Math.max(leftBounds, Math.min(rightBounds, targetX))
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
function drawSingleCircle ({ ctx, screenHeight, screenWidth, circle, racket, remove, brickClassifyMap, propList }) {
  const stepLength = 4
  ctx.beginPath()
  ctx.fillStyle = 'white'

  let targetY = circle.y + circle.ySpeed * stepLength
  let targetX = circle.x + circle.xSpeed * stepLength

  if (targetY > screenHeight) {
    remove()
    return
  }

  const intersectInfo = arroundIntersectDetect({
    propList,
    brickClassifyMap,
    racket,
    circle: {
      ...circle,
      x: targetX,
      y: targetY,
      originX: circle.x,
      originY: circle.y
    }
  })

  if (targetY < 0) {
    circle.ySpeed = Math.abs(circle.ySpeed)
  }
  if (targetX >= screenWidth || targetX <= 0) {
    circle.xSpeed = Math.abs(circle.xSpeed) * (targetX <= 0 ? 1 : -1)
  }
  if (intersectInfo.hasIntersect) {
    if (intersectInfo.yIntersect) {
      circle.ySpeed *= -1
    }
    if (intersectInfo.xIntersect) {
      circle.xSpeed *= -1
    }
    if (intersectInfo.xSpeed) {
      // 赋予水平方向的速度
      circle.xSpeed += intersectInfo.xSpeed
      if (Math.abs(circle.xSpeed) > 1) {
        circle.xSpeed = circle.xSpeed > 0 ? 1 : -1
      }
    }
    if (intersectInfo.idearPosition) {
      targetY = intersectInfo.idearPosition.y
      targetX = intersectInfo.idearPosition.x
    }
  }
  circle.y = targetY
  circle.x = targetX
  ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI)
  ctx.fill()
}

function drawBricks ({ ctx, brickList }) {
  brickList.forEach((brick) => {
    if (!brick || !brick.show) return
    drawSingleBrick(ctx, brick)
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

function drawProps ({ ctx, propList, screenHeight, racket }) {
  propList.forEach((prop) => {
    drawSingleProp(ctx, {
      prop,
      screenHeight,
      racket,
      remove: () => {
        const removeIndex = propList.findIndex((item) => item.id === prop.id)
        propList.splice(removeIndex, 1)
      }
    })
  })
}
function drawSingleProp (ctx, { prop, screenHeight, remove, racket }) {
  const stepLength = 2
  ctx.beginPath()
  ctx.fillStyle = 'orange'

  const targetY = prop.y + stepLength
  const res = checkIntersect(racket, prop, true).hasIntersect
  if (res) {
    // 分裂小球
    emitEvent('split')
    remove()
    return
  }
  if (targetY > screenHeight) {
    remove()
    return
  }
  prop.y = targetY
  ctx.arc(prop.x, targetY, prop.r, 0, 2 * Math.PI)
  ctx.fill()
}

function tryRemoveBrick (brick) {
  emitEvent('removeBrick', brick)
}
function tryDisplayProp (brick, propList) {
  if (brick.prop === undefined) return
  propList.push({
    id: ++window.id,
    x: brick.x + BRICK_WIDTH / 2,
    y: brick.y + BRICK_HEIGHT / 2,
    r: 5
  })
}
// 查看球上下左右有没有东西触碰
function arroundIntersectDetect ({ brickClassifyMap, racket, circle, propList }) {
  const detectRes = {
    hasIntersect: false
  }
  // 找出小球附近的所有有可能的格子
  const arroundBricks = findArroundBricks(circle)
  // 碰撞的砖块中，找出距离最短的，获取其碰撞面，碰撞x速度等信息
  const minDistanceInfo = {
    distance: Number.MAX_SAFE_INTEGER,
    brick: null
  }
  arroundBricks.filter(
    (brick) =>
      brickClassifyMap[brick.x] &&
      brickClassifyMap[brick.x][brick.y] &&
      brickClassifyMap[brick.x][brick.y].show
  ).forEach((brick) => {
    const brickCenterPoint = {
      x: brick.x + brick.width / 2,
      y: brick.y + brick.height / 2
    }
    const distance = Math.pow(circle.x - brickCenterPoint.x, 2) + Math.pow(circle.y - brickCenterPoint.y, 2)
    if (distance < minDistanceInfo.distance) {
      minDistanceInfo.distance = distance
      minDistanceInfo.brick = brickClassifyMap[brick.x][brick.y]
    }
  })
  if (minDistanceInfo.brick) {
    const intersectRes = checkIntersect(minDistanceInfo.brick, circle)
    Object.assign(detectRes, intersectRes)
    // 归位，碰撞后要把小球移动到碰撞边界的位置。
    // 若小球位置在砖块内部，下一轮的碰撞检测会有偏差
    const idearPosition = { ...circle }
    if (detectRes.xIntersect) {
      idearPosition.x = circle.xSpeed > 0
        ? (minDistanceInfo.brick.x - circle.r)
        : (minDistanceInfo.brick.x + BRICK_WIDTH + circle.r)
    } else if (detectRes.yIntersect) {
      idearPosition.y =
        circle.ySpeed > 0
          ? (minDistanceInfo.brick.y - circle.r)
          : (minDistanceInfo.brick.y + BRICK_HEIGHT + circle.r)
    }
    Object.assign(detectRes, {
      idearPosition
    })
    // 碰撞后掉落道具
    tryDisplayProp(minDistanceInfo.brick, propList)
    // 碰撞后消除砖块
    tryRemoveBrick(minDistanceInfo.brick)
  } else {
    const hasIntersectWithRacket = checkIntersect(racket, circle, true)
    if (hasIntersectWithRacket.hasIntersect) {
      Object.assign(detectRes, hasIntersectWithRacket)
      // 归位，碰撞后要把小球移动到碰撞边界的位置。
      Object.assign(detectRes, {
        idearPosition: {
          y: racket.y - circle.r,
          x: circle.x
        }
      })
    }
  }
  return detectRes
}
// 触碰检测。
// 不能卡在球拍中间，最上边以下的，不算触碰
function checkIntersect (rect, circle, isRacket = false) {
  const targetPoint = {}
  if (isRacket) {
    if (circle.y > 580 && circle.y < 620) {
      targetPoint.y = rect.y
    } else {
      return {
        hasIntersect: false,
        y: false,
        x: false,
        xSpeed: 0
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
const COS_DEG_45 = Math.SQRT2 / 2
function calcIntersectInfo ({ targetPoint, circle, isRacket, rect }) {
  const res = {
    hasIntersect: false,
    yIntersect: false,
    xIntersect: false,
    xSpeed: 0
  }
  const distance = Math.sqrt(Math.pow(targetPoint.x - circle.x, 2) + Math.pow(targetPoint.y - circle.y, 2))
  const hasIntersect = distance <= circle.r

  if (hasIntersect) {
    if (isRacket) {
      return {
        hasIntersect: true,
        yIntersect: true,
        xSpeed: rect.stepLength / rect.maxStepLength * rect.xVerctor,
        distance
      }
    }
    const rectCenterPoint = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
    // 用碰撞之前的圆的位置和矩形位置推算碰撞角度
    // 直接碰撞之后的位置计算不准，因为那个时候很大可能已经重叠了
    const cos = getRadian({ x: circle.originX, y: circle.originY }, rectCenterPoint)
    const isIntersectY = cos < COS_DEG_45
    Object.assign(res, {
      hasIntersect: true,
      yIntersect: isIntersectY,
      xIntersect: !isIntersectY,
      distance
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
function getRadian (point1, point2) {
  // 夹角
  const vector1 = {
    x: point1.x - point2.x,
    y: point1.y - point2.y
  }
  const vector2 = {
    x: vector1.x > 0 ? 1 : -1,
    y: 0
  }
  // 向量的乘积
  const productValue = (vector1.x * vector2.x) + (vector1.y * vector2.y)
  // 向量1的模
  const vector1Value = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y)
  // 向量2的模
  const vector2Value = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y)
  // 余弦公式
  const cosValue = productValue / (vector1Value * vector2Value)
  return cosValue
}
// 小球分裂
function division (vector) {
  return [
    rotateVector(vector, 120),
    rotateVector(vector, 240)
  ]
}
// 逆时针旋转 deg 度的向量转换方法
function rotateVector (vector, deg) {
  const xSpeed = vector.x * Math.cos(deg) - vector.y * Math.sin(deg)
  const ySpeed = vector.y * Math.cos(deg) + vector.x * Math.sin(deg)
  return { xSpeed, ySpeed }
}

export { drawCircles, collectDraw, drawRacket, drawBricks, drawProps }
