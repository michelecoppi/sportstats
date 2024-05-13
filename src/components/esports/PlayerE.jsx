import React, {useState, useEffect} from 'react'
import { useParams} from 'react-router-dom'
import Nations from './Nations'
import DotaRoles from './DotaRoles'




const  PlayerE = () => {
    const {id} = useParams()
    const [player, setPlayer] = useState([])
    const [nextMatches, setNextMatches] = useState([])
     useEffect(() => {
        fetch(`https://europe-west1-sportstats-42976.cloudfunctions.net/getPlayerE?id=${id}`)
        .then(response => response.json())
        .then(response => {setPlayer(response)
        })
        .catch(err => console.error(err))

    }, [])

   
  return (
    <div className='text-center'><h1>{player.name}</h1>
    <img src={player.image_url} style={{width:"200px", height:"200px",marginBottom:"30px"}}/>
    <p>First Name: {player.first_name}</p>
    <p>Last Name: {player.last_name}</p>
    {player.current_videogame && player.current_videogame.name==="Dota 2" &&  <p>Role: <DotaRoles role={player.role}/> </p>}
   
    <p>Country: <Nations prefix={player.nationality}/> </p>
    
    </div>
  )
}

export default PlayerE