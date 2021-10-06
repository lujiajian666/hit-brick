import {
  startDrawCircle,
  collectDraw,
  startDrawRect
} from '../../util/draw'
import './index.css'
let id = 0
const rectPoint = {
  x: 200,
  y: 600,
  height: 10,
  width: 120,
  xDirect: 1,
  stepLength: 0,
  maxStepLength: 14
}
function createSingleCircle ({ rectPoint, x, y }) {
  const singleCircle = {
    id: ++id,
    handle: startDrawCircle,
    param: {
      point: {
        x,
        y,
        r: 5,
        xDirect: 0,
        yDirect: -1
      },
      rectPoint: rectPoint
    }
  }
  return singleCircle
}
function IndexPage () {
  const height = 700
  const width = 500
  const [isOver, setIsOver] = React.useState(false)
  const [drawList, setDrawList] = React.useState([
    {
      handle: startDrawRect,
      param: {
        point: rectPoint
      }
    }
  ])
  setTimeout(() => {
    const context = document.getElementById('canvas').getContext('2d')
    const drawAll = collectDraw(context, width, height, (sign) => {
      if (sign === 'end') {
        setIsOver(true)
      } else {
        setIsOver(false)
      }
    })

    document.onkeydown = function (event) {
      const e = event || window.event
      if (e && e.keyCode === 39) { // press >
        rectPoint.xDirect = 1
        rectPoint.stepLength = rectPoint.maxStepLength
      } else if (e && e.keyCode === 37) { // press <
        rectPoint.xDirect = -1
        rectPoint.stepLength = rectPoint.maxStepLength
      }
    }

    drawAll(drawList)
  }, 0)

  const inner = (
    <div>
      <canvas id="canvas" height={height} width={width} className="canvas"></canvas>
      {
        isOver &&
        <div className='over-box'>Game Over</div>
      }
      <button onClick={() => {
        const newCircle = createSingleCircle({
          rectPoint,
          drawList,
          x: rectPoint.x + rectPoint.width / 2,
          y: rectPoint.y - 10
        })
        setDrawList([...drawList, newCircle])
      }}>发球</button>
    </div>
  )
  return inner
}

export default IndexPage
