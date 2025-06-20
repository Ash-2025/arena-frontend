import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export default function GamesDifficultyDonut({
  playedByGamesDifficulty
}: {
  playedByGamesDifficulty: { difficulty: string | null; count: number }[]
}) {
  const chartData = React.useMemo(
    () =>
      playedByGamesDifficulty.map((row, i) => ({
        game: row.difficulty ?? "Unknown",
        plays: Number(row.count),
        fill: `var(--chart-${(i % 10) + 1})`, // cycle colors
      })),
    [playedByGamesDifficulty]
  )

  const totalPlays = chartData.reduce((acc, curr) => acc + curr.plays, 0)

  const chartConfig: ChartConfig = React.useMemo(
    () => ({
      plays: { label: "Games Played" },
      ...Object.fromEntries(
        chartData.map((d, i) => [
          d.game,
          { label: d.game, color: `var(--chart-${(i % 10) + 1})` },
        ])
      ),
    }),
    [chartData]
  )

  return (
    <Card className="flex flex-col w-[45%]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Games Played</CardTitle>
        <CardDescription>By Difficulty</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="plays"
              nameKey="game"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalPlays.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Games
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}