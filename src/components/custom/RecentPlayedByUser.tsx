import {
  useReactTable,
  type ColumnDef,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table"

type GameSessionRow = {
  gameName: string
  difficulty: string
  createdAt: string
  timeTaken: number
}

const columns: ColumnDef<GameSessionRow>[] = [
  {
    accessorKey: "gameName",
    header: "Game Name",
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "timeTaken",
    header: "Time Taken (sec)",
  },
]

export default function GameSessionsTable({ data }: { data: GameSessionRow[] }) {
    
    const table = useReactTable<GameSessionRow>({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    })

  return (
    <div className="rounded-md border">
      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="border-b">
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-4 py-2 text-left text-sm font-medium"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="border-b hover:bg-muted/50">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-2 text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
