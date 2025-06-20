import { getGameData } from "@/API";
import GamesTable from "@/components/custom/RecentGames";
import { type gamename } from "@/Schemas";
import { useQuery } from "@tanstack/react-query";
import {useParams} from "react-router-dom";

export default function GameDataPage() {
    const {game_name} = useParams();
    console.log(`${game_name} - ${new Date().getSeconds()}`)

    const {data:GamedataByName, isLoading} = useQuery({
        queryKey:['gamedata', game_name],
        queryFn: () => getGameData(game_name as gamename),
        enabled: !!game_name
    })
    if(!game_name){
        return <p>invalid</p>
    }
    if(isLoading){
        return <p>loading....</p>
    }
    return (
        <div className="h-full flex flex-col gap-2">
            <div className="text-2xl font-bold">{game_name.toUpperCase()}</div>
            <GamesTable data={GamedataByName?.data} />

        </div>
    )    
}
