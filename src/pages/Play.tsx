import { useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchOneGame } from "@/API";
import SudokuGame from "@/components/custom/Sudoku";
import  Wordle  from "@/components/custom/Wordle";
function Play() {
    //app_url/game/:game_name?date=&difficulty= 
    // im pretty sure ive made some error
    // const { game_name } = useParams();
    const [searchParams] = useSearchParams();

    const date = searchParams.get("date");
    const difficulty = searchParams.get("difficulty");
    const game_name = searchParams.get("game_name");

    const name = React.useMemo(() => {
        switch (game_name) {
            case "sudoku":
            case "wordle":
                return game_name;
            default:
                return "";
        }
    }, [game_name]);

    if (name.length === 0 || difficulty === null || date === null) {
        return <div>Error: Invalid game name or difficulty</div>;
    }
    const { data, error, isLoading } = useQuery({
        queryKey: ["game",name, difficulty, date],
        queryFn: () => fetchOneGame({ game_name: name, difficulty, created_at: date }),
        retry: false, // don't retry if it returns 400 or 404
        enabled: !!game_name && !!difficulty && !!date,
    });
    // console.log("Fetched game data:", data.data[0].puzzle);
    

    if (isLoading || !data) return <p>Loading...</p>;
    if (error) return <p>Error: {(error as Error).message}</p>;

    switch (name) {
        case "sudoku":
            const Sudokudata = data.data as number[][];

            return <SudokuGame data={Sudokudata} id={data.id} />
        case "wordle":
            const WordleData = data.data as string;
            return <Wordle data={WordleData} id={data.id} />
        default:
            return <div>Error: Game not found</div>;
    }
}

export default Play