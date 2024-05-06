import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import './search.css'

function TeamsEsports() {

const [team, setTeam] = useState("");
const [teams, setTeams] = useState([]);
const navigate = useNavigate();

const handleClick = () => {
   if(team === "" || team === null || team === undefined || team.trim()===""){
    alert("Please enter a team name");
    setTeams([]);
   }
    else{
    fetch(`https://europe-west1-sportstats-42976.cloudfunctions.net/getTeamsEsports?name=${team}`)
    .then(response => response.json())
    .then(response => setTeams(response))
    .catch(err => console.error(err));
    }
}

const handleInfo = (team) => {
  navigate('/teamE', { state: { team } });
}

  return (
    <div><h1 className='text-center'>
      Search Teams</h1>
      <div className='text-center'>
        <input type="text" value={team} onChange={(e)=> setTeam(e.target.value)}></input> 
          <button onClick={handleClick} className='btn btn-primary my-4 search'>Search</button>
      </div>
      {teams.length>0 && (
        
  <table className='table table-responsive'>
    <thead>
      <tr>
        <th>Team Name</th>
        <th></th>
        <th>Videogame</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {teams.map((team) => (
        <tr key={team.id}>
          <th>{team.name}</th>
          <th>
            <img
              src={team.image_url}
              style={{ width: "50px", height: "50px" }}
            />
          </th>
          <th>{team.current_videogame.name}</th>
          <th>
            <button
              onClick={() => handleInfo(team)}
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

export default TeamsEsports