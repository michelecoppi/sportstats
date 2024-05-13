import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './search.css'

function PlayersEsports() {
  const [player, setPlayer] = useState("")
  const [players, setPlayers] = useState([])
  const navigate = useNavigate()
  
  const handleClick = () => {
    if(player=== "" || player === null || player === undefined || player.trim()===""){
     alert("Please enter a player name");
     setPlayers([]);
    }
     else{
     fetch(`https://europe-west1-sportstats-42976.cloudfunctions.net/getAllPlayersE?name=${player}`)
     .then(response => response.json())
     .then(response => setPlayers(response))
     .catch(err => console.error(err));
     }
 }

 const handleInfo = (id) => {
  navigate(`/playerE/${id}` );
}

  return (
    <div className='text-center'><h1 >Search Players</h1>
        <div className='text-center'>
        <input type="text" value={player} onChange={(e)=> setPlayer(e.target.value)}></input> 
          <button onClick={handleClick} className='btn btn-primary my-4 search'>Search</button>
      </div>
      {players.length>0 && (
        
  <table className='table table-responsive'>
    <thead>
      <tr>
        <th>Player Name</th>
        <th></th>
        <th>Videogame</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {players.map((player) => (
        <tr key={player.id}>
          <th>{player.name}</th>
          <th>
            <img
              src={player.image_url}
              style={{ width: "50px", height: "50px" }}
            />
          </th>
          <th>{player.current_videogame.name}</th>
          <th>
            <button
              onClick={() => handleInfo(player.id)}
              className="btn btn-primary my-4"
              style={{ width: "100px", height: "35px" }}
            >
              View Info
            </button>
          </th>
        </tr>
      ))}
    </tbody>
  </table>
)}
    </div>

  )
}

export default PlayersEsports