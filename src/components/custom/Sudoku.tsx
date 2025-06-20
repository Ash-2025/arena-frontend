import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { baseUrl } from "@/API"

interface SudokuGameProps {
  data: number[][]
  id: string
}

// Generate a simple Sudoku puzzle (for demo purposes)
const generatePuzzle = (): number[][] => {
  const puzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ]
  return puzzle
}

// const solution = [
//   [5, 3, 4, 6, 7, 8, 9, 1, 2],
//   [6, 7, 2, 1, 9, 5, 3, 4, 8],
//   [1, 9, 8, 3, 4, 2, 5, 6, 7],
//   [8, 5, 9, 7, 6, 1, 4, 2, 3],
//   [4, 2, 6, 8, 5, 3, 7, 9, 1],
//   [7, 1, 3, 9, 2, 4, 8, 5, 6],
//   [9, 6, 1, 5, 3, 7, 2, 8, 4],
//   [2, 8, 7, 4, 1, 9, 6, 3, 5],
//   [3, 4, 5, 2, 8, 6, 1, 7, 9],
// ]

export default function SudokuGame({ data, id }: SudokuGameProps) {

  const curr = Date.now()

  const [puzzle, _] = useState<number[][]>(data || generatePuzzle())
  const [userGrid, setUserGrid] = useState<number[][]>(() => (data || generatePuzzle()).map((row) => [...row]))
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>([0, 0])
  const [gameState, setGameState] = useState<"playing" | "won">("playing")
  const [errors, setErrors] = useState<Set<string>>(new Set())

  const [startTime, setStartTime] = useState<number | null>(null)
  // const [elapsed, setElapsed] = useState<number>(0)

  const gridRef = useRef<HTMLDivElement>(null)
  const cellRefs = useRef<(HTMLDivElement | null)[][]>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(null)),
  )

  // Validate Sudoku rules
  const isValidMove = (grid: number[][], row: number, col: number, num: number): boolean => {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (i !== col && grid[row][i] === num) return false
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (i !== row && grid[i][col] === num) return false
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if ((i !== row || j !== col) && grid[i][j] === num) return false
      }
    }

    return true
  }


  // Check if puzzle is complete and correct
  const isPuzzleCorrect = (grid: number[][]): boolean => {
    // Check rows
    for (let i = 0; i < 9; i++) {
      const seen = new Set()
      for (let j = 0; j < 9; j++) {
        const val = grid[i][j]
        if (val < 1 || val > 9 || seen.has(val)) return false
        seen.add(val)
      }
    }
    // Check columns
    for (let j = 0; j < 9; j++) {
      const seen = new Set()
      for (let i = 0; i < 9; i++) {
        const val = grid[i][j]
        if (val < 1 || val > 9 || seen.has(val)) return false
        seen.add(val)
      }
    }
    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const seen = new Set()
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const val = grid[boxRow * 3 + i][boxCol * 3 + j]
            if (val < 1 || val > 9 || seen.has(val)) return false
            seen.add(val)
          }
        }
      }
    }
    // Run win animation
    setTimeout(() => {
      const cells = cellRefs.current.flat().filter(Boolean)
      gsap.to(cells, {
        keyframes: [
          { scale: 1 },
          { scale: 1.2 },
          { scale: 1 }
        ],
        rotation: 360,
        duration: 0.8,
        stagger: {
          grid: [9, 9],
          from: "center",
          amount: 0.5,
        },
        ease: "back.out(1.7)",
        onComplete: () => {
          gsap.set(cells, { scale: 1, rotation: 0 })
        },
      })
    }, 100)
    return true
  }

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (gameState !== "playing") return
    setSelectedCell([row, col])

    // Animate cell selection
    const cell = cellRefs.current[row][col]
    if (cell) {
      gsap.to(cell, {
        scale: 1.05,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      })
    }
  }



  // Handle number input
  const handleNumberInput = (num: number) => {
    if (!selectedCell || gameState !== "playing") return

    // Start the timer if not started
    if (startTime === null) setStartTime(Date.now())

    const [row, col] = selectedCell
    if (puzzle[row][col] !== 0) return // Can't modify pre-filled cells

    const newGrid = userGrid.map((r) => [...r])
    const newErrors = new Set(errors)
    const cellKey = `${row}-${col}`

    if (num === 0) {
      // Clear cell
      newGrid[row][col] = 0
      newErrors.delete(cellKey)
    } else {
      newGrid[row][col] = num

      // Check if move is valid
      if (!isValidMove(newGrid, row, col, num)) {
        newErrors.add(cellKey)
        const cell = cellRefs.current[row][col]
        if (cell) {
          gsap.to(cell, {
            // backgroundColor: "rgb(239 68 68)", // red-500
            duration: 0.15,
            yoyo: true,
            repeat: 1,
            ease: "power2.out",
          })
        }
      } else {
        newErrors.delete(cellKey)
      }
    }

    setUserGrid(newGrid)
    setErrors(newErrors)
  }

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return

      if (e.key >= "1" && e.key <= "9") {
        handleNumberInput(Number.parseInt(e.key))
      } else if (e.key === "Backspace" || e.key === "Delete") {
        handleNumberInput(0)
      } else if (selectedCell) {
        const [row, col] = selectedCell
        let newRow = row
        let newCol = col

        switch (e.key) {
          case "ArrowUp":
            newRow = Math.max(0, row - 1)
            break
          case "ArrowDown":
            newRow = Math.min(8, row + 1)
            break
          case "ArrowLeft":
            newCol = Math.max(0, col - 1)
            break
          case "ArrowRight":
            newCol = Math.min(8, col + 1)
            break
        }

        if (newRow !== row || newCol !== col) {
          setSelectedCell([newRow, newCol])
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedCell, gameState])


  const isPuzzleComplete = (userGrid: number[][]) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const val = userGrid[row][col]
        if (val < 1 || val > 9) return false
      }
    }
    return true
  }


  const handleSubmit = async () => {
    if (!isPuzzleComplete(userGrid)) {
      alert("Please fill all cells before submitting.")
      return
    }
    if (!isPuzzleCorrect(userGrid)) {
      alert("Sudoku is not correct!")
      setGameState("playing")
      return
    }

    setGameState("won")
    const now = Date.now()

    // Call API
    await fetch(`${baseUrl}/game/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        time: Math.floor(now-curr / 1000),
      }),
    })

  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-background p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Sudoku</h1>
          <p className="text-muted-foreground text-sm">
            Fill the grid so each row, column, and 3×3 box contains digits 1-9
          </p>
        </div>


        <div
          ref={gridRef}
          className="grid grid-cols-9 gap-0 w-full aspect-square max-w-[400px] mx-auto mb-6 border-2 border-border rounded-lg overflow-hidden"
        >
          {userGrid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isPreFilled = puzzle[rowIndex][colIndex] !== 0
              const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex
              // const hasError = errors.has(`${rowIndex}-${colIndex}`)
              const isThickBorderRight = (colIndex + 1) % 3 === 0 && colIndex !== 8
              const isThickBorderBottom = (rowIndex + 1) % 3 === 0 && rowIndex !== 8

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  ref={el => { cellRefs.current[rowIndex][colIndex] = el }}
                  className={cn(
                    "aspect-square border border-border bg-card flex items-center justify-center text-lg font-semibold cursor-pointer transition-colors duration-200",
                    isSelected && "ring-2 ring-primary ring-inset",
                    isPreFilled && "bg-muted text-muted-foreground",
                    !isPreFilled && "text-foreground hover:bg-accent",
                    isThickBorderRight && "border-r-2 border-r-border",
                    isThickBorderBottom && "border-b-2 border-b-border",
                  )}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell !== 0 && cell}
                </div>
              )
            }),
          )}
        </div>

        {gameState === "won" && (
          <div className="text-center mb-4">
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">
              🎉 Congratulations! You solved it!
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <Button onClick={handleSubmit} variant="outline" className="mb-2">
            Submit
          </Button>
        </div>

        <div className="text-center mt-4 text-sm text-muted-foreground">
          <p>Use keyboard (1-9) or click cells to play</p>
          <p>Arrow keys to navigate • Backspace to clear</p>
        </div>
      </div>
    </div>
  )
}

