import Sudoku from "@/components/custom/Sudoku";
import Wordle from "@/components/custom/Wordle";

export const gameComponentMap = {
    sudoku: Sudoku,
    // Add other game components here as needed
    wordle:Wordle
} as const;