import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetGames, getMostRecentGames } from "@/API.ts";
import { Suspense } from "react";

import GamesTable from "@/components/custom/RecentGames";
import { Calendar } from "@/components/ui/calendar";
import React from "react";
import { format } from 'date-fns'

import { GameCards } from "@/components/custom/GameList";

export default function Games() {
    const navigate = useNavigate();
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    const handleDate = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        console.log(selectedDate)
        if (selectedDate) {
            const formattedDate = format(selectedDate, "yyyy-MM-dd")
            // window.open(`http://localhost:3000/game/date/from?date=${formattedDate}`, '_blank')
            navigate(`/games/${formattedDate}`)
        }
    }
    const { data: games, isLoading, isError } = useQuery({
        queryKey: ['games'],
        queryFn: GetGames,
        enabled: true,
    })
    // make another query that fetches most recent puzzles 
    const { data: recentGames } = useQuery({
        queryKey: ['recentGames'],
        queryFn: getMostRecentGames
    })

    if (isLoading) {
        return <p>loading...</p>
    }
    if (isError || !games) {
        return <p>Error</p>
    }

    return (
        <>

            <Suspense fallback={<div></div>}>
                <main className="w-full h-full flex flex-row gap-2">
                    <main className="w-3/4 h-full rounded-md p-2 flex flex-col gap-2">
                        <div className="w-full h-1/4">
                            {/* render game cards here */}
                            <GameCards games={games.data} />
                        </div>
                        <div className="w-full h-3/4">
                            {/* render recent games table here */}
                            <GamesTable data={recentGames} />
                        </div>
                    </main>

                    <main className="w-1/4 h-full border-1 rounded-md flex flex-col p-2">
                        <div className="w-full p-1">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={handleDate}
                                className="rounded-md border shadow-sm w-full h-full"
                                captionLayout="dropdown"
                            />
                        </div>
                    </main>
                </main>
            </Suspense>
        </>
    )
}



