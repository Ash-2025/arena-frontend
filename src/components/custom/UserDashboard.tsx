// import * as React from "react"
// import { TrendingUp } from "lucide-react"
// import { Label, Pie, PieChart } from "recharts"

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"
import { fetchUserDashboard, fetchUserRecentGames } from "@/API";
import { useQuery } from "@tanstack/react-query"
import GamesPlayedDonut from "../dashboard/DonutChart1";
import GamesDifficultyDonut from "../dashboard/DonutChart2";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import GameSessionsTable from "./RecentPlayedByUser";


type chartByGameName = {
  gameName: string | null;
  count: number;
}[]

type chartByGameDifficulty = {
  difficulty: string | null;
  count: number;
}[]


const UserDashboard = () => {

  // write a react query to fetch the user dashboard data from the backend

  const { data, error, isLoading } = useQuery({
    queryKey: ["userDashboard"],
    queryFn: fetchUserDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  // now data is already the "data" object, not the envelope
  return (
    <div className="w-full h-full flex flex-col gap-4 p-2">
      <div className="h-[20%] w-full p-2 flex flex-row items-center justify-center gap-4">
        <StatsCard it={{ label: "Total Points", value: data.points }} />
        <StatsCard it={{ label: "Average Time Taken", value: data.avgTime }} />
        <StatsCard it={{ label: "Total Games Played", value: data.totalGamesPlayed }} />
      </div>

      <div className="h-[40%] w-full p-2 flex flex-row items-center justify-center gap-4">
        <GamesPlayedDonut playedByGamesName={data.playedByGamesName as chartByGameName} />
        <GamesDifficultyDonut playedByGamesDifficulty={data.playedByDifficulty as chartByGameDifficulty} />
      </div>

      <div className="h-[40%] w-full">
        <UserRecentGames />
      </div>
    </div>
  );
}

function UserRecentGames() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["userRecentGames"],
    queryFn: fetchUserRecentGames,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="h-[40%] w-full p-2 text-center">Error: {(error as Error).message}</div>;
  return (
    <div className="h-[40%] w-full p-2 overflow-y-scroll scroll-smooth">
      <GameSessionsTable data={data} />
    </div>
  )
}

function StatsCard({ it }: { it: { label: string; value: number } }) {
  return (
    <Card key={it.value} className="w-[45%] h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{it.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tabular-nums">{it.value}</div>
      </CardContent>
    </Card>
  )
}

export default UserDashboard