import { GetDataByDate } from '@/API'
import GamesTable from '@/components/custom/RecentGames'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'


function GameDataByDate() {
  const {date} = useParams();

  const { data } = useQuery({
    queryKey: ['gameDataByDate', date],
    queryFn: () => GetDataByDate(date!),
    enabled:!!date
  })
  
  return (
    <div>
      <GamesTable data={data?.data} />
    </div>
  )
}

export default GameDataByDate