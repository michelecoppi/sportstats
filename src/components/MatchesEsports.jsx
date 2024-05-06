import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from './Spinner';

const cardStyle = {
  width: "18rem",
  margin: "1rem",
  border: "1px solid gray",
  borderRadius: "10px",
  maxwidth: "450px",

};

const MatchesEsports = () => {
  const navigate=useNavigate();
  const [loading, setLoading] = useState(true);
  const [Games, setGames] = useState("csgo");
  const [Matches, setMatches] = useState([]);
  const [LiveMatches, setLiveMatches] = useState([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [Games]);

  const handleGamesChange = (event) => {
    setGames(event.target.value);
  };

  useEffect(() => {

    fetch(`https://europe-west1-sportstats-42976.cloudfunctions.net/getTournaments?game=${Games}`)
      .then(response => response.json())
      .then(response => setLiveMatches(response))
      .catch(err => console.error(err));

    fetch(`https://europe-west1-sportstats-42976.cloudfunctions.net/getTournamentsRunning?game=${Games}`)
      .then(response => response.json())
      .then(response => setMatches(response))
      .catch(err => console.error(err));


  }, [Games]);


  const handleInfo = (id) => {
    navigate(`/tournament/${id}`)
  };

  return (


    <div>
      <>
      {loading ? (
      <Spinner />
    ) : (
      Matches.length === 0 || LiveMatches === 0 ? <div>
         <center> <select value={Games} onChange={handleGamesChange} className="text-center form-select">
            <option value="csgo">CS:GO</option>
            <option value="lol">League of Legends</option>
            <option value="dota2">Dota 2</option>
            <option value="ow">Overwatch</option>
            <option value="r6siege">Rainbow Six Siege</option>
            <option value="rl">Rocket League</option>
            <option value="starcraft-brood-war">StarCraft Brood War</option>
            <option value="starcraft-2">StarCraft 2</option>
            <option value="lol-wild-rift">LoL Wild Rift</option>
            <option value="valorant">Valorant</option>
            <option value="kog">King of Glory</option>
            <option value="codmw">Call of Duty</option>
            <option value="fifa">FIFA</option>
            <option value="pubg">PUBG</option>
          
          </select></center>
        <h2 className='text-center'>Nothing found</h2></div> : (
        <div>
          <center> <select value={Games} onChange={handleGamesChange} className="text-center form-select">
          <option value="csgo">CS:GO</option>
            <option value="lol">League of Legends</option>
            <option value="dota2">Dota 2</option>
            <option value="ow">Overwatch</option>
            <option value="r6siege">Rainbow Six Siege</option>
            <option value="rl">Rocket League</option>
            <option value="starcraft-brood-war">StarCraft Brood War</option>
            <option value="starcraft-2">StarCraft 2</option>
            <option value="lol-wild-rift">LoL Wild Rift</option>
            <option value="valorant">Valorant</option>
            <option value="kog">King of Glory</option>
            <option value="codmw">Call of Duty</option>
            <option value="fifa">FIFA</option>
            <option value="pubg">PUBG</option>
          
          </select></center>
          <h2 className="text-center">Live Tournaments for {Games}</h2>
          <div className="d-flex flex-wrap text-center">

            {LiveMatches.map(match => (
              <div key={match.id} className="card mx-auto mb-3 col-sm-12 col-md-4" style={cardStyle}>
                <div className="card-header">Tournament</div>
                <div className="card-body">
                  <h5 className="card-title">{match.league.name}</h5>
                  <p className="card-text">{match.name}</p>
                  <img src={match.league.image_url} style={{ width: "30px", height: "30px" }}></img>
                  

                </div>
               <div className='btn btn-primary' type="button"  onClick={() => handleInfo(match.id)} style={{margin:"20px"}}>view Info</div>
                <div className="card-footer text-muted">
                  <p className="card-text">
                    Live now
                  </p>

                </div>
              </div>
            ))}
          </div>


          <h2 className="text-center">Upcoming Tournaments for {Games}</h2>

          <div className="d-flex flex-wrap text-center">

            {Matches.map(match => (
              <div key={match.id} className="card mx-auto mb-3 col-sm-12 col-md-4" style={cardStyle}>
                <div className="card-header">Tournament</div>
                <div className="card-body">
                  <h5 className="card-title">{match.name}</h5>
                  <p className="card-text">{match.league.name}</p>
                  <img src={match.league.image_url} style={{ width: "30px", height: "30px" }}></img>

                </div>
                <div className='btn btn-primary' type="button"  onClick={() => handleInfo(match.id)} style={{margin:"20px"}}>view Info</div>
                <div className="card-footer text-muted">
                  <p className="card-text">
                    {new Date(match.begin_at).toLocaleDateString()}{' '}
                    {new Date(match.begin_at).toLocaleTimeString().slice(0, -3)}
                  </p>

                </div>
              </div>
            ))}
          </div>
        </div>
      )
      )}
      </>
    </div>

  );
};

export default MatchesEsports;
