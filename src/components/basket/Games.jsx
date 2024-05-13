import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone";
import { Link } from "react-router-dom";

const Games = (props) => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const options = {
      method: "GET",
      url: "https://api.balldontlie.io/v1/games",
      params: { team_ids: [props.id], dates: getDates() },
      headers: {
        Authorization: process.env.REACT_APP_AUTHORIZATION_KEY,
      },
    };
    axios
      .request(options)
      .then((response) => {
        let games = response.data.data.filter(game => game.status === "Final");
        games.sort((a, b) => new Date(b.date) - new Date(a.date));
        games = games.slice(0, 3);
        setGames(games);
        setError(""); 
      })
      .catch((error) => {
        setError("An error has occurred, please try again later");
        console.error(error);
      });
  }, [props.id]);

  function getDates() {
    const dates = [];
    for (let i = 0; i < 30; i++) {
      dates.push(moment().subtract(i, "days").format("YYYY-MM-DD"));
    }
    return dates;
  }

  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);



  return (
   
    <div>
    <h3 className="text-center">Last 3 Games</h3>
    <div className="d-flex flex-wrap">
      {error && <p>{error}</p>}
      {games &&
        games.map((game) => (
          <div className="card text-center mx-auto w-100" key={game.id}>
            <div className="card-header">Game</div>
            <div className="card-body">
              <h4 className="card-title">
                {game.home_team.full_name} vs {game.visitor_team.full_name}
              </h4>
              <h5 className="d-flex justify-content-between">
                <span className="text-left">{game.home_team_score}</span>
                <Link to={`/match/${game.id}/${game.home_team.id}/${game.visitor_team.id}/${game.home_team.full_name}/${game.visitor_team.full_name}`}><button type="button" className="btn btn-primary text-center">View Stats</button></Link>
                <span className="text-right">{game.visitor_team_score}</span>
              </h5>
              <p className="card-text">
                Date:{" "}
                {moment(game.date)
                  .tz(timezone)
                  .format("MM/DD/YY")}
              </p>
            </div>
            <div className="card-footer text-muted">
              {game.status}
            </div>
          </div>
        ))}
    </div>
  </div>
  );
  

};
export default Games;

