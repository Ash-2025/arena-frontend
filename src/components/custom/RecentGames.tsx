import React, { useState, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useNavigate } from "react-router-dom"

type GameData = {
  game_name: string
  difficulty: string
  created_at: string
}

const columnHelper = createColumnHelper<GameData>()

export default function GameStatsTable({ data }: { data: GameData[] | undefined }) {
  if (!data || data.length === 0) {
    return <div className="flex justify-center align-center">
      Sorry, We don't have any data for this request.
    </div>
  }
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "created_at",
      desc: true, // Most recent first
    },
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [gameNameFilter, setGameNameFilter] = useState<string>("")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("")

  const columns = useMemo(
    () => [
      columnHelper.accessor("game_name", {
        header: "Game Name",
        cell: (info) => <div className="font-medium capitalize">{info.getValue()}</div>,
      }),
      columnHelper.accessor("difficulty", {
        header: "Difficulty",
        cell: (info) => {
          const difficulty = info.getValue()
          const colorClass =
            difficulty === "easy"
              ? "text-green-600 bg-green-50"
              : difficulty === "medium"
                ? "text-yellow-600 bg-yellow-50"
                : "text-red-600 bg-red-50"

          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${colorClass}`}>{difficulty}</span>
          )
        },
      }),
      columnHelper.accessor("created_at", {
        header: "Date Created",
        cell: (info) => info.getValue(),
        sortingFn: "datetime",
      }),
    ],
    [],
  )

  // Update column filters when individual filters change
  React.useEffect(() => {
    const filters: ColumnFiltersState = []

    if (gameNameFilter) {
      filters.push({
        id: "game_name",
        value: gameNameFilter,
      })
    }

    if (difficultyFilter) {
      filters.push({
        id: "difficulty",
        value: difficultyFilter,
      })
    }

    setColumnFilters(filters)
  }, [gameNameFilter, difficultyFilter])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const clearFilters = () => {
    setGameNameFilter("")
    setDifficultyFilter("")
  }

  const navigate = useNavigate();
  const GetRow = (row: any) => {
    const params = new URLSearchParams({
      game_name: row.game_name,
      difficulty: row.difficulty,
      date: row.created_at, // your API expects "date"
    });
    // make an api call to fetch more details about the row clicked
    navigate(`/game-details?${params.toString()}`)

  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <Card className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
        {/* <CardHeader className="flex-shrink-0">
        </CardHeader> */}
        <CardContent className="flex-1 flex flex-col min-h-0">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6 flex-shrink-0">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Game Name</label>
              {/* // TODO change filter based on where table is rendered */}
              <Select value={gameNameFilter} onValueChange={setGameNameFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All games" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All games</SelectItem>
                  <SelectItem value="wordle">Wordle</SelectItem>
                  <SelectItem value="sudoku">Sudoku</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Difficulty</label>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="bg-white text-black">
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Table Container with Scroll */}
          <div className="flex-1 min-h-0 rounded-md border">
            <div className="h-full overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="font-semibold">
                          {header.isPlaceholder ? null : (
                            <div
                              className={`flex items-center gap-2 ${header.column.getCanSort() ? "cursor-pointer select-none hover:text-foreground/80" : ""
                                }`}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {header.column.getCanSort() && (
                                <div className="flex flex-col">
                                  {header.column.getIsSorted() === "desc" ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : header.column.getIsSorted() === "asc" ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <div className="h-4 w-4 opacity-50">
                                      <ChevronUp className="h-3 w-3" />
                                      <ChevronDown className="h-3 w-3 -mt-1" />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => {
                      return (
                        <TableRow key={row.id} className="hover:bg-muted/50 cursor-pointer hover:text-teal-400 hover:underline" onClick={() => GetRow(row.original)}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground flex-shrink-0">
            <div>
              Showing {table.getFilteredRowModel().rows.length} of {data.length} entries
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}