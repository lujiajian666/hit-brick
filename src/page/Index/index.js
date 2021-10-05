import {
  startDrawCircle,
  collectDraw,
  startDrawRect
} from '../../util/draw'
import './index.css'
let id = 0
function createSingleCircle ({ rectPoint, drawList }) {
  const singleCircle = {
    id: ++id,
    handle: startDrawCircle,
    param: {
      point: {
        x: 0,
        y: 0,
        r: 5,
        xDirect: 1,
        yDirect: 1
      },
      rectPoint: rectPoint
    }
  }
  drawList.push(singleCircle)
}
function IndexPage () {
  const height = 700
  const width = 500
  const rectPoint = {
    x: 200,
    y: 600,
    height: 10,
    width: 120,
    xDirect: 1,
    stepLength: 0
  }
  const drawList = [
    {
      handle: startDrawRect,
      param: {
        point: rectPoint
      }
    }
  ]
  setTimeout(() => {
    const context = document.getElementById('canvas').getContext('2d')
    const drawAll = collectDraw(context, width, height)

    document.onkeydown = function (event) {
      const e = event || window.event
      if (e && e.keyCode === 39) { // press >
        rectPoint.xDirect = 1
        rectPoint.stepLength = 14
      } else if (e && e.keyCode === 37) { // press <
        rectPoint.xDirect = -1
        rectPoint.stepLength = 14
      }
    }

    drawAll(drawList)
  }, 0)

  const inner = (
    <div>
      <canvas id="canvas" height={height} width={width} className="canvas"></canvas>
      <button onClick={() => createSingleCircle({ rectPoint, drawList })}>发球</button>
    </div>
  )
  return inner
}

export default IndexPage