import React, { useState, useEffect } from "react";
import axios from 'axios'
import { Link } from "react-router-dom";
import { Avatar } from '@mui/material';
import './pallino.css'

const Livematches =() => {
    const [games, setGames] = useState([]);
    const [error, setError] = useState("");
    
   


    useEffect(() => {
      const date = new Date().toISOString().split('T')[0];
      const dateY = new Date();
      const dateT = new Date();
      dateY.setDate(dateY.getDate() - 1);
      const yesterday = dateY.toISOString().split('T')[0];
      dateT.setDate(dateY.getDate() + 1);
      const tomorrow = dateY.toISOString().split('T')[0];

      const options = {
        method: "GET",
        url: "https://api.balldontlie.io/v1/games",
        params: { dates: [date,yesterday,tomorrow] },
        headers: {
          Authorization: process.env.REACT_APP_AUTHORIZATION_KEY,
        },
      };
      axios
        .request(options)
        .then((response) => {
           let games = response.data.data.filter(game => game.status === "1st Qtr" || game.status === "2nd Qtr" || game.status==="3rd Qtr" ||game.status==="4th Qtr");
          setGames(games);
          setError(""); 
        })
        .catch((error) => {
          
          setError("An error has occurred, please try again later");
          console.error(error);
        });
    }, []);

  return (
    <div className="d-flex flex-wrap">
    {error && <p>{error}</p>}
    {games &&
      games.map((game) => (
        <div className="card text-center mx-auto mb-3 col-sm-12 col-md-4" key={game.id} style={{margin:'1rem', maxWidth:"450px",borderRadius:"10px"}}>
          <div className="card-header">Game</div>
          <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div>
              <Avatar src={"/images/logo" + game.home_team.id + ".png"} sx={{ width: 50, height: 50 }} />
              </div>
              <div>
               <Avatar src={"/images/logo" + game.visitor_team.id + ".png"} sx={{ width: 50, height: 50 }} />
             </div>
             </div>
            <h4 className="card-title">
              {game.home_team.full_name} vs {game.visitor_team.full_name}
            </h4>
            
            <h5 className="d-flex justify-content-between">
              <span className="text-left">{game.home_team_score}</span>
              <span className="text-center">{game.time}</span>
              <span className="text-right">{game.visitor_team_score}</span>
            </h5>
            <Link to={`/match/${game.id}/${game.home_team.id}/${game.visitor_team.id}/${game.home_team.full_name}/${game.visitor_team.full_name}`}><button type="button" className="btn btn-primary text-center">View Stats</button></Link>
          </div>
          <div className="card-footer text-muted">
          <div className="dot"></div> Live
          </div>
        </div>
      ))}
  </div>

  )
}

export default Livematches