import React, { useState, useRef } from "react"
import "./App.css"

const ROWS = 40
const COLS = 40
const CELL_SIZE = 15

const initialOrganisms: [number, number][] = [
  [21, 17],
  [22, 17],
  [23, 17],
  [23, 18],
  [23, 19],
  [22, 19],
  [21, 19],
]

const setInitialGrid = (): number[][] => {
  const rows: number[][] = []
  for (let i = 0; i < ROWS; i++) {
    const row: number[] = []
    for (let j = 0; j < COLS; j++) {
      row.push(0)
    }
    rows.push(row)
  }

  initialOrganisms.forEach(([x, y]) => {
    rows[x][y] = 1
  })
  return rows
}

const App: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>(setInitialGrid())
  const [id, setId] = useState<NodeJS.Timer>()

  const [start, setStart] = useState<boolean>(false)
  const startRef = useRef(start)
  startRef.current = start

  const runSimulation = () => {
    if (!startRef.current) {
      return
    }

    setGrid((grid) => {
      const newGrid = grid.map((row, i) =>
        row.map((cell, j) => {
          const neighbors = countNeighbors(grid, i, j)
          if (cell === 1) {
            if (neighbors === 2 || neighbors === 3) {
              return 1
            } else {
              return 0
            }
          } else {
            if (neighbors === 3) {
              return 1
            } else {
              return 0
            }
          }
        })
      )
      return newGrid
    })
  }

  const countNeighbors = (grid: number[][], x: number, y: number): number => {
    let count = 0
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const row = (x + i + ROWS) % ROWS
        const col = (y + j + COLS) % COLS
        count += grid[row][col]
      }
    }
    count -= grid[x][y]
    return count
  }

  const handleStart = () => {
    setStart(true)

    let simId = setInterval(() => {
      runSimulation()
    }, 100)

    setId(simId)
  }

  const handleStop = () => {
    setStart(false)
    clearInterval(id)
  }
  const handleReset = () => {
    setStart(false)
    clearInterval(id)
    setGrid(setInitialGrid())
  }

  return (
    <div className="App">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
        }}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: cell ? "black" : "white",
                border: "solid 1px gray",
              }}
            />
          ))
        )}
      </div>
      <div className="buttons">
        <button className="button" onClick={handleStart}>
          Start
        </button>
        <button className="button" onClick={handleStop}>
          Stop
        </button>
        <button className="button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  )
}

export default App
