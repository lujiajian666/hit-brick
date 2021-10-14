import {
  drawCircles,
  collectDraw,
  drawRacket,
  drawBricks
} from '../../util/draw'
import { calcLevelInfoFactory } from '../../util/levelInfo'
import './index.css'
let id = 0
const calcLevelInfo = calcLevelInfoFactory()

const racketInfo = {
  x: 200,
  y: 600,
  height: 10,
  width: 120,
  xVerctor: 1,
  stepLength: 0,
  maxStepLength: 14
}
const circleList = []
const drawList = {
  brick: {
    handle: drawBricks,
    param: {
      brickListAvailable: calcLevelInfo(0).available,
      brickList: calcLevelInfo(0).brickList
    }
  },
  racket: {
    handle: drawRacket,
    param: {
      racket: racketInfo
    }
  },
  circle: {
    handle: drawCircles,
    param: {
      circleList,
      racket: racketInfo,
      brickClassifyMap: calcLevelInfo(0).classifyMap
    }
  }
}

function addCircle ({ x, y }) {
  circleList.push({
    id: ++id,
    x,
    y,
    r: 5,
    xDirect: 0,
    yDirect: -1
  })
}

function IndexPage () {
  const screenHeight = 700
  const screenWidth = 500
  const [endText, setEndText] = React.useState('')

  setTimeout(() => {
    const context = document.getElementById('canvas').getContext('2d')
    const drawAll = collectDraw(context, screenHeight, screenWidth, (text) => {
      setEndText(text)
    })

    document.onkeydown = function (event) {
      const e = event || window.event
      if (e && e.keyCode === 39) { // press >
        racketInfo.xVerctor = 1
        racketInfo.stepLength = racketInfo.maxStepLength
      } else if (e && e.keyCode === 37) { // press <
        racketInfo.xVerctor = -1
        racketInfo.stepLength = racketInfo.maxStepLength
      }
    }

    drawAll(drawList)
  }, 0)

  const inner = (
    <div>
      <canvas id="canvas" height={screenHeight} width={screenWidth} className="canvas"></canvas>
      {
        endText !== '' &&
        <div className='over-box'>{endText}</div>
      }
      <button onClick={() => {
        addCircle({
          x: racketInfo.x + racketInfo.width / 2,
          y: racketInfo.y - 10
        })
      }}>发球</button>
    </div>
  )
  return inner
}

export default IndexPage
