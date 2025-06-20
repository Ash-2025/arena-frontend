import { z } from 'zod'
export const ListAllGamesSchema = z.object({
  data: z.array(z.string())
})
export type ListAllGamesSchemaType = z.infer<typeof ListAllGamesSchema>

export const SudokuDataSchema = z.object({
  data: z.object({
    easy: z.array(z.array(z.number().min(0).max(9)).length(9)).length(9),
    medium: z.array(z.array(z.number().min(0).max(9)).length(9)).length(9),
    hard: z.array(z.array(z.number().min(0).max(9)).length(9)).length(9),
  }),
});
export type SudokuDataSchemaType = z.infer<typeof SudokuDataSchema>


export const getMostRecentGamesSchema = z.object({
  data: z.array(z.object({
    game_name: z.string().max(32),
    difficulty: z.string().max(32),
    created_at: z.string(),
  }))
});

export const GameDataSchema = z.object({
  data: z.array(z.object({
    game_name: z.string().max(32),
    difficulty: z.string().max(32),
    created_at: z.string()
  }))
})


// schema for wordle
export const WordleDataSchema = z.object({
  easy: z.string(),
  medium: z.string(),
  hard: z.string(),
})
export type WordleDataSchemaType = z.infer<typeof WordleDataSchema>

export const m = {
  wordle: WordleDataSchema,
  sudoku: SudokuDataSchema,
}
export type gamename = keyof typeof m

export type GameDataTypeMap = {
  wordle: WordleDataSchemaType;
  sudoku: SudokuDataSchemaType;
};

