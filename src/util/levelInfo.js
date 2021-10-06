export default [
  {
    bricks: () => [
      ...Array(10).fill().map((_, indexY) => {
        return Array(25).fill().map((_, index) => ({
          x: index * 20, y: indexY * 10, indestructible: false
        }))
      }).flat(),
      ...Array(25).fill().map((_, index) => ({
        x: index * 20, y: 100, indestructible: true
      })).filter((_, index) => ![10, 11, 12, 13, 14, 15, 16, 17].includes(index))
    ]
  }
]
