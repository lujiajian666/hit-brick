import {
  drawCircles,
  collectDraw,
  drawRacket,
  drawBricks,
  drawProps
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
  xVerctor: 0,
  stepLength: 0,
  maxStepLength: 12
}
const circleList = []
const propList = []
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
      propList,
      brickClassifyMap: calcLevelInfo(0).classifyMap
    }
  },
  prop: {
    handle: drawProps,
    param: {
      propList
    }
  }
}

function addCircle ({ x, y }) {
  circleList.push({
    id: ++id,
    x,
    y,
    r: 5,
    xSpeed: 0,
    ySpeed: -1
  })
}

function IndexPage () {
  const screenHeight = 700
  const screenWidth = 500
  const [endText, setEndText] = React.useState('')
  const [pause, setPause] = React.useState(false)

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

    drawAll(drawList, pause)
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
      &nbsp;&nbsp;&nbsp;
      <button onClick={() => {
        setPause(!pause)
      }}>
        {pause ? '开始' : '暂停'}
      </button>
    </div>
  )
  return inner
}

export default IndexPage
