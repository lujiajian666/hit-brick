export const PROP_TYPE = {
  FISSION: Symbol('type'),
  THREE_LAUNCH: Symbol('type')
}
export const BRICK_HEIGHT = 10
export const BRICK_WIDTH = 10
const levelInfo = [
  {
    bricks () {
      let idCount = 0
      const list = [
        ...Array(20).fill().map((_, indexY) => {
          return [
            { id: ++idCount, x: 20, y: indexY * 10, indestructible: false, show: true },
            { id: ++idCount, x: 30, y: indexY * 10, indestructible: false, show: true, prop: indexY % 10 === 0 ? PROP_TYPE.THREE_LAUNCH : undefined },
            { id: ++idCount, x: 40, y: indexY * 10, indestructible: false, show: true },
            { id: ++idCount, x: 50, y: indexY * 10, indestructible: false, show: true },
            { id: ++idCount, x: 60, y: indexY * 10, indestructible: false, show: true },
            { id: ++idCount, x: 70, y: indexY * 10, indestructible: false, show: true },
            { id: ++idCount, x: 120, y: indexY * 10, indestructible: false, show: true },
            { id: ++idCount, x: 130, y: indexY * 10, indestructible: false, show: true, prop: indexY % 4 === 0 ? PROP_TYPE.THREE_LAUNCH : undefined },
            { id: ++idCount, x: 140, y: indexY * 10, indestructible: false, show: true },
            { id: ++idCount, x: 150, y: indexY * 10, indestructible: false, show: true },
            { id: ++idCount, x: 160, y: indexY * 10, indestructible: false, show: true },
            { id: ++idCount, x: 170, y: indexY * 10, indestructible: false, show: true },
            { id: ++idCount, x: 220, y: indexY * 10, indestructible: false, show: true, prop: indexY % 7 === 0 ? PROP_TYPE.THREE_LAUNCH : undefined },
            { id: ++idCount, x: 230, y: indexY * 10, indestructible: false, show: true },
            { id: ++idCount, x: 240, y: indexY * 10, indestructible: false, show: true },
            { id: ++idCount, x: 250, y: indexY * 10, indestructible: false, show: true, prop: PROP_TYPE.THREE_LAUNCH },
            { id: ++idCount, x: 260, y: indexY * 10, indestructible: false, show: true },
            { id: ++idCount, x: 270, y: indexY * 10, indestructible: false, show: true },
            { id: ++idCount, x: 320, y: indexY * 10, indestructible: false, show: true },
            { id: ++idCount, x: 330, y: indexY * 10, indestructible: false, show: true },
            { id: ++idCount, x: 340, y: indexY * 10, indestructible: false, show: true, prop: indexY % 5 === 0 ? PROP_TYPE.THREE_LAUNCH : undefined },
            { id: ++idCount, x: 350, y: indexY * 10, indestructible: false, show: true },
            { id: ++idCount, x: 360, y: indexY * 10, indestructible: false, show: true },
            { id: ++idCount, x: 370, y: indexY * 10, indestructible: false, show: true },
            { id: ++idCount, x: 420, y: indexY * 10, indestructible: false, show: true, prop: indexY % 11 === 0 ? PROP_TYPE.THREE_LAUNCH : undefined },
            { id: ++idCount, x: 430, y: indexY * 10, indestructible: false, show: true },
            { id: ++idCount, x: 440, y: indexY * 10, indestructible: false, show: true },
            { id: ++idCount, x: 450, y: indexY * 10, indestructible: false, show: true },
            { id: ++idCount, x: 460, y: indexY * 10, indestructible: false, show: true, prop: indexY % 5 === 0 ? PROP_TYPE.THREE_LAUNCH : undefined },
            { id: ++idCount, x: 470, y: indexY * 10, indestructible: false, show: true }
          ]
        }).flat(),
        ...Array(50).fill().map((_, index) => ({
          id: ++idCount, x: index * 10, y: 200, indestructible: true, show: true
        })).filter((_, index) => index < 10 || (index > 15 && index < 35) || (index > 40 && index < 50))
      ]
      list.forEach((item) => {
        item.height = BRICK_HEIGHT
        item.width = BRICK_WIDTH
      })
      return list
    }
  }
]

function classifyBricks (brickList) {
  const bricksMap = {}
  for (let i = 0; i < brickList.length; i++) {
    const brick = brickList[i]
    if (bricksMap[brick.x] === undefined) {
      bricksMap[brick.x] = {}
    }
    if (bricksMap[brick.x][brick.y] === undefined) {
      bricksMap[brick.x][brick.y] = brick
    }
  }
  return bricksMap
}

export function calcLevelInfoFactory () {
  return (level) => {
    const brickList = levelInfo[level].bricks()
    const classifyMap = classifyBricks(brickList)
    return {
      brickList,
      brickListIndestructible: brickList.filter((item) => item.indestructible).length,
      brickListShowCount: brickList.filter((item) => item.show).length,
      classifyMap
    }
  }
}
