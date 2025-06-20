import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { cn } from "@/lib/utils"
import { baseUrl } from "@/API"

interface WordleGameProps {
  data: string
  id:string
}

type CellState = "empty" | "correct" | "present" | "absent"

interface Cell {
  letter: string
  state: CellState
}

export default function Wordle({ data,id }: WordleGameProps) {
  const curr = Date.now()
  const [grid, setGrid] = useState<Cell[][]>(() =>
    Array(6)
      .fill(null)
      .map(() =>
        Array(5)
          .fill(null)
          .map(() => ({ letter: "", state: "empty" as CellState })),
      ),
  )
  const [currentRow, setCurrentRow] = useState(0)
  const [currentCol, setCurrentCol] = useState(0)
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing")
  const [currentGuess, setCurrentGuess] = useState("")

  const gridRef = useRef<HTMLDivElement>(null)
  const cellRefs = useRef<(HTMLDivElement | null)[][]>([])
  const gameRef = useRef<HTMLDivElement>(null)

  // Initialize cell refs
  useEffect(() => {
    cellRefs.current = Array(6)
      .fill(null)
      .map(() => Array(5).fill(null))
  }, [])

  // Animate current cell

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState !== "playing") return

      const key = event.key.toUpperCase()

      if (key === "ENTER") {
        if (currentGuess.length === 5) {
          submitGuess()
        } else {
          const rowCells = cellRefs.current[currentRow]
          if (rowCells) {
            rowCells.forEach((cell) => {
              if (cell) {
                gsap.to(cell, {
                  keyframes: [
                    { x: -5, duration: 0.1 },
                    { x: 5, duration: 0.1 },
                    { x: -5, duration: 0.1 },
                    { x: 5, duration: 0.1 },
                    { x: 0, duration: 0.1 },
                  ],
                  ease: "power2.out",
                  onComplete: () => {
                    // Ensure position is reset
                    gsap.set(cell, { x: 0 })
                  },
                })
              }
            })
          }
        }
      } else if (key === "BACKSPACE") {
        if (currentCol > 0) {
          const newGrid = [...grid]
          newGrid[currentRow][currentCol - 1] = { letter: "", state: "empty" }
          setGrid(newGrid)
          setCurrentCol(currentCol - 1)
          setCurrentGuess(currentGuess.slice(0, -1))
        }
      } else if (/^[A-Z]$/.test(key) && currentCol < 5) {
        const newGrid = [...grid]
        newGrid[currentRow][currentCol] = { letter: key, state: "empty" }
        setGrid(newGrid)
        setCurrentCol(currentCol + 1)
        setCurrentGuess(currentGuess + key)

        // Animate the cell that was just filled
        const cell = cellRefs.current[currentRow]?.[currentCol]
        if (cell) {
          gsap.fromTo(cell, { scale: 0.8 }, { scale: 1, duration: 0.2, ease: "back.out(1.7)" })
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentRow, currentCol, currentGuess, gameState, grid])

  // Animate current cell highlight
  useEffect(() => {
    // Remove highlight from all cells
    cellRefs.current.forEach((row) => {
      row.forEach((cell) => {
        if (cell) {
          gsap.to(cell, {
            borderColor: "var(--color-border)",
            duration: 0.2,
          })
        }
      })
    })

    if (currentRow < 6 && currentCol < 5) {
      const cell = cellRefs.current[currentRow]?.[currentCol]
      if (cell) {
        gsap.to(cell, {
          borderColor: "var(--color-foreground)",
          duration: 0.2,
        })
      }
    }
  }, [currentRow, currentCol, gameState])

  const submitGuess = () => {
    const guess = currentGuess.toUpperCase()
    const target = data.toUpperCase().trim()
    const newGrid = [...grid]

    // Calculate letter states
    const targetLetters = target.split("")
    const guessLetters = guess.split("")
    const letterCounts: { [key: string]: number } = {}

    // Count letters in target word
    targetLetters.forEach((letter) => {
      letterCounts[letter] = (letterCounts[letter] || 0) + 1
    })

    // First pass: mark correct letters
    guessLetters.forEach((letter, index) => {
      if (letter === targetLetters[index]) {
        newGrid[currentRow][index] = { letter, state: "correct" }
        letterCounts[letter]--
      }
    })

    // Second pass: mark present/absent letters
    guessLetters.forEach((letter, index) => {
      if (newGrid[currentRow][index].state === "empty") {
        if (letterCounts[letter] > 0) {
          newGrid[currentRow][index] = { letter, state: "present" }
          letterCounts[letter]--
        } else {
          newGrid[currentRow][index] = { letter, state: "absent" }
        }
      }
    })

    setGrid(newGrid)

    // Animate row reveal
    const rowCells = cellRefs.current[currentRow]
    if (rowCells) {
      rowCells.forEach((cell, index) => {
        if (cell) {
          gsap.to(cell, {
            rotateX: 90,
            duration: 0.3,
            delay: index * 0.1,
            ease: "power2.inOut",
            onComplete: () => {
              gsap.to(cell, {
                rotateX: 0,
                duration: 0.3,
                ease: "power2.inOut",
              })
            },
          })
        }
      })
    }

    // Check win condition
    if (guess === target) {
      setGameState("won")
      setTimeout(() => animateWin(), 800)
    } else if (currentRow === 5) {
      setGameState("lost")
      setTimeout(() => animateLose(), 800)
    } else {
      setCurrentRow(currentRow + 1)
      setCurrentCol(0)
      setCurrentGuess("")
    }
  }

  const animateWin = () => {
    const winningRow = cellRefs.current[currentRow]
    if (winningRow && gameRef.current) {
      const tl = gsap.timeline()

      // Create "YOU WON!" text element
      const winText = document.createElement("div")
      winText.innerHTML = "YOU WON!"
      winText.className =
        "absolute inset-0 flex items-center justify-center text-6xl font-bold text-green-500 pointer-events-none"
      winText.style.opacity = "0"
      gameRef.current.appendChild(winText)

      // Animate winning row bounce
      winningRow.forEach((cell, index) => {
        if (cell) {
          tl.to(
            cell,
            {
              y: -20,
              duration: 0.3,
              ease: "power2.out",
            },
            index * 0.1,
          ).to(
            cell,
            {
              y: 0,
              duration: 0.4,
              ease: "bounce.out",
            },
            index * 0.1 + 0.3,
          )
        }
      })

      // Fancy text animation
      tl.to(
        winText,
          {
            opacity: 1,
            scale: 1.2,
            rotation: 10,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          0.5,
        )
        .to(
          winText,
          {
            scale: 1,
            rotation: -10,
            duration: 0.25,
            ease: "back.out(1.7)",
          },
          1.0,
        )
        .to(
          winText,
          {
            scale: 1,
            rotation: 0,
            duration: 0.25,
            ease: "back.out(1.7)",
          },
          1.25,
      )
        .to(
          winText,
          {
            y: -20,
            duration: 0.3,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
          },
          1.2,
        )
        .to(
          winText,
          {
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
              winText.remove()
            },
          },
          3,
        )
    }
  }

  const animateLose = () => {
    if (gameRef.current) {
      const tl = gsap.timeline()
      tl.to(gameRef.current, {
        x: -10,
        duration: 0.1,
        ease: "power2.out",
      })
        .to(gameRef.current, {
          x: 10,
          duration: 0.1,
          ease: "power2.out",
        })
        .to(gameRef.current, {
          x: -10,
          duration: 0.1,
          ease: "power2.out",
        })
        .to(gameRef.current, {
          x: 10,
          duration: 0.1,
          ease: "power2.out",
        })
        .to(gameRef.current, {
          x: 0,
          duration: 0.2,
          ease: "power2.out",
        })
    }
  }

  const getCellClassName = (cell: Cell, rowIndex: number, colIndex: number) => {
    const baseClasses =
      "w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold transition-colors duration-300"
    console.log(rowIndex,colIndex)
    const stateClasses = {
      empty: "border-border bg-background text-foreground",
      correct: "border-green-500 bg-green-500 text-white",
      present: "border-yellow-500 bg-yellow-500 text-white",
      absent: "border-gray-500 bg-gray-500 text-white",
    }

    return cn(baseClasses, stateClasses[cell.state])
  }

  // const resetGame = () => {
  //   if (cellRefs.current) {
  //     cellRefs.current.forEach((row) => {
  //       row.forEach((cell) => {
  //         if (cell) {
  //           gsap.killTweensOf(cell)
  //           gsap.set(cell, {
  //             x: 0,
  //             y: 0,
  //             scale: 1,
  //             rotateX: 0,
  //             borderColor: "var(--color-border)",
  //           })
  //         }
  //       })
  //     })
  //   }

  //   if (gameRef.current) {
  //     gsap.killTweensOf(gameRef.current)
  //     gsap.set(gameRef.current, { x: 0, y: 0, scale: 1 })
  //   }
  //
  //   setGrid(
  //     Array(6)
  //       .fill(null)
  //       .map(() =>
  //         Array(5)
  //           .fill(null)
  //           .map(() => ({ letter: "", state: "empty" as CellState })),
  //       ),
  //   )
  //   setCurrentRow(0)
  //   setCurrentCol(0)
  //   setCurrentGuess("")
  //   setGameState("playing")
  // }

  const handleSubmit = async () => {
    if (gameState === "won") {
      const now = Date.now()
      // Call API
      const res = await fetch(`${baseUrl}/game/submit`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          time: Math.floor(now-curr / 1000),
        }),
      })
      if(!res.ok){
        alert("You have already submitted this game")
        return
      }
      else{
        alert("Game submitted successfully")
      }
    }
  }

  return (
    <div ref={gameRef} className="flex flex-col h-screen items-center justify-center space-y-6 relative">
      <div ref={gridRef} className="grid grid-rows-6 gap-2">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                ref={(el) => {
                  if (cellRefs.current[rowIndex]) {
                    cellRefs.current[rowIndex][colIndex] = el
                  }
                }}
                className={getCellClassName(cell, rowIndex, colIndex)}
              >
                {cell.letter}
              </div>
            ))}
          </div>
        ))}
      </div>

      {gameState !== "playing" && (
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold">
            {gameState === "won" ? (
              <span className="text-green-500">🎉 You Won! 🎉</span>
            ) : (
              <span className="text-red-500">Game Over! The word was {data}</span>
            )}
          </div>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Submit
          </button>
        </div>
      )}

      <div className="text-sm text-muted-foreground text-center max-w-sm">
        <p>Type letters to guess the word. Press Enter to submit, Backspace to delete.</p>
        <p className="mt-2">
          <span className="inline-block w-4 h-4 bg-green-500 rounded mr-1"></span>
          Correct position
          <span className="inline-block w-4 h-4 bg-yellow-500 rounded mr-1 ml-4"></span>
          Wrong position
          <span className="inline-block w-4 h-4 bg-gray-500 rounded mr-1 ml-4"></span>
          Not in word
        </p>
      </div>
    </div>
  )
}
