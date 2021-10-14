const levelInfo = [
  {
    bricks: () => {
      let idCount = 0
      return [
        ...Array(10).fill().map((_, indexY) => {
          return Array(10).fill().map((_, index) => ({
            id: ++idCount, x: index * 50, y: indexY * 10, indestructible: false, show: true
          }))
        }).flat(),
        ...Array(10).fill().map((_, index) => ({
          id: ++idCount, x: index * 50, y: 100, indestructible: true, show: true
        })).filter((_, index) => ![5, 6, 7].includes(index))
      ]
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
  const cache = {}
  return (level) => {
    if (cache[level] === undefined) {
      const brickList = levelInfo[level].bricks()
      const classifyMap = classifyBricks(brickList)
      cache[level] = {
        brickList,
        classifyMap
      }
    }
    return cache[level]
  }
}
