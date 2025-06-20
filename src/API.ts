import {GameDataSchema, getMostRecentGamesSchema, ListAllGamesSchema, type gamename} from "@/Schemas.ts";
import axios from 'axios'

export const baseUrl = import.meta.env.BASE_URL;

export async function GetGames(){
    const res = await fetch(`${baseUrl}/game`, {credentials: 'include'});
    const json = await res.json();

    // parse the response json
    const parsed = ListAllGamesSchema.safeParse(json);
    if(!parsed.success){
        throw new Error(parsed.error.message)
    }
    return parsed.data
}


// make a request to get the most recent games
export async function getMostRecentGames() {
    const res = await fetch(`${baseUrl}/game/recent`, {credentials: 'include'});
    const json = await res.json();
    const parsed = getMostRecentGamesSchema.safeParse(json);
    if(!parsed.success){
        throw new Error(parsed.error.message)
    }
    return parsed.data.data;
}

// api to get all data for a specific game
export async function getGameData(game_name: gamename, limit:number = 10, offset:number = 0) {
    const res = await axios.get(`${baseUrl}/game/${game_name}`, {
        params: {
            limit: limit,
            offset: offset
        },
        withCredentials: true
    });
    const json = res.data;
    const parsed = GameDataSchema.safeParse(json);
    if(!parsed.success){
        throw new Error(parsed.error.message)
    }
    return parsed.data;

}

export async function GetDataByDate(date:string){
    const res = await axios.get(`${baseUrl}/game/date/from?date=${date}`, {
        withCredentials: true
    });
    const json = res.data;
    const parsed = GameDataSchema.safeParse(json);
    if(!parsed.success){
        throw new Error(parsed.error.message)
    }
    return parsed.data;
}

// export async function GetPuzzleData(game_name: gamename | "", difficulty: string, created_at: string) {
//     const res = await axios.get(`/game/${game_name}/puzzle`, {
//         params: {
//             difficulty: difficulty,
//             date: created_at
//         }
//     });
//     const json = res.data;
//     return json;
// }

// api/games.ts
export const fetchOneGame = async ({ game_name, difficulty, created_at }: {
  game_name: string;
  difficulty: string;
  created_at: string;
}) => {
  const params = new URLSearchParams({
    game_name,
    difficulty,
    date: created_at, // backend expects "date"
  });

  const res = await fetch(`${baseUrl}/game/gaame/one?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch game");
  }

  return res.json();
};


export async function middlewareTest() {
    const res = await fetch(`${baseUrl}/middleware-test`, {credentials: 'include'});
    const json = await res.json();
    return json;
}

export async function fetchUserDashboard() {
  const res = await fetch(`${baseUrl}/user/dashboard`, {
    credentials: "include",
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    console.log(json)
    throw new Error(json.error || "Failed to fetch dashboard");
  }

  return json.data;
}

export async function fetchUserRecentGames() {
  const res = await fetch(`${baseUrl}/user/recent`, {
    credentials: "include",
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    console.log(json)
    throw new Error(json.error || "Failed to fetch recent games");
  }

  return json.data;
}