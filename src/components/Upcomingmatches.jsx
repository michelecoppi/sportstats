import React, { useState, useEffect } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { Avatar } from '@mui/material';
import '../pallino.css'
import Spinner from "./Spinner";

const Upcomingmathces = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [ora, setOra] = useState([]);
  const navigate = useNavigate();





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
      params: { dates: [date, yesterday, tomorrow] },
      headers: {
        Authorization: process.env.REACT_APP_AUTHORIZATION_KEY,
      },
    };
    axios
      .request(options)
      .then((response) => {
        let games = response.data.data.filter(game => game.status !== "1st Qtr" && game.status !== "2nd Qtr" && game.status !== "3rd Qtr" && game.status !== "4th Qtr" && game.status !== "Final");
        
        console.log(response)


        let data = [];
        let ora = [];
        games.sort((a, b) => new Date(a.date.slice(0, -14) + " " + a.status.slice(0, -3)) - new Date(b.date.slice(0, -14) + " " + b.status.slice(0, -3)));

        {
          games.map((game) => {
          
            
            const date = new Date(game.status);
            const utcString = date.toISOString();
            const utcDate = new Date(utcString);
    
            const options = {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: 'numeric',
              minute: 'numeric',
            };
            
            const dateFormatted = utcDate.toLocaleDateString(undefined, options);
            const dateTime = dateFormatted.split(', ');
           
            data.push(dateTime[0]);
            ora.push(dateTime[1]);
          })
        }


        setData(data);
        setOra(ora);
        setGames(games);
        setError("");
      })
      .catch((error) => {
        setError("An error has occurred, please try again later");
        console.error(error);
      });
  }, []);
 const handleBet = (data,id) => {
    navigate(`/bet`, { state: { id,data } })
 }
  return (
    <div className="d-flex flex-wrap">
      {error && <p>{error}</p>}

      {games.length>0 ? ( 
        games.map((game, index) => (

          
          <div className="card text-center mx-auto mb-3 col-sm-12 col-md-4" style={{margin:'1rem', maxWidth:"450px"}} key={game.id}>
            <div className="card-header">Game</div>
            <div className="card-body" >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div>
              <Avatar src={"/images/logo" + game.home_team.id + ".png"} sx={{ width: 50, height: 50 }} />
              </div>
              <div>
               <Avatar src={"/images/logo" + game.visitor_team.id + ".png"} sx={{ width: 50, height: 50 }} />
             </div>
             </div>
              <h4 className="card-title" >
                {game.home_team.full_name} vs {game.visitor_team.full_name}
              </h4>
           
           
                {/* {data[index]} */}
            


            </div>
            <div>
              <button type="button" className="btn btn-warning text-center" onClick={() => handleBet(data[index],game.id)}>Bet</button>
            </div>
            <br></br>
            <div className="card-footer text-muted">
             {data[index]} {ora[index]}
            </div>
         
          </div>
        
        ))
      ) : (
        <Spinner  />
      )}

    </div>
  )

}

export default Upcomingmathces