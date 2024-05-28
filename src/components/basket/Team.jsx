import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Games from './Games';
import Spinner from '../Spinner.jsx';
import { Avatar } from '@mui/material';
import axios from 'axios';

const Team = (props) => {

  const [games, setGames] = useState([]);
  const { id } = useParams();
  const [team, setTeam] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const date = new Date().toISOString().split('T')[0];
    const dateY = new Date();
    const dateT = new Date();
    dateY.setDate(dateY.getDate() - 1);
    const yesterday = dateY.toISOString().split('T')[0];
    dateT.setDate(dateY.getDate() + 1);
    const tomorrow = dateY.toISOString().split('T')[0];

    const options = {
      method: 'GET',
      url: `https://api.balldontlie.io/v1/teams/${id}`,
      headers: {
        Authorization: process.env.REACT_APP_AUTHORIZATION_KEY,
      }
    };
    axios.request(options)
      .then(response => {

        setTeam(response.data.data);
        setError('');
      })
      .catch(error => {
        setError("An error has occurred, please try again later");
        console.error(error);
      });

    const teams = {
      method: "GET",
      url: "https://api.balldontlie.io/v1/games",
      params: { dates: [date, yesterday, tomorrow], team_ids: [id] },
      headers: {
        Authorization: process.env.REACT_APP_AUTHORIZATION_KEY,
      },
    };
    axios
      .request(teams)
      .then((response) => {
        let games = response.data.data.filter(game => game.status === "1st Qtr" || game.status === "2nd Qtr" || game.status === "3rd Qtr" || game.status === "4th Qtr");
        setGames(games);
        setError("");
      })
      .catch((error) => {
        setError("An error has occurred, please try again later");
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [id]);


  const handleBack = () => {
    window.history.back();
  }

  return (
    <div>
    {loading ? (
      <Spinner />
    ) : (
      <>
        {error && <p>{error}</p>}
        {team && (
          <div>
            <div className='row align-items-start container-fluid'>
              <div className='col-3'>
                <button className="btn btn-danger btn-back" onClick={handleBack}>Back</button>
              </div>
              <div className='col-6'>
                <h1 className='text-center'>{team.full_name}</h1>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Avatar src={"/images/logo" + id + ".png"} sx={{ width: 100, height: 100 }} />
            </div>
            <p className='text-center'>City: {team.city}</p>
            <p className='text-center'>Conference: {team.conference}</p>
            <p className='text-center'>Division: {team.division}</p>
            <p className='text-center'>Abbreviation: {team.abbreviation}</p>
            {games.length > 0 ? (
              <div className='text-center'>
                {games.map((game) => (
                  <p key={game.id}>
                    The team is playing against {team.full_name === games[0].home_team.full_name ? games[0].visitor_team.full_name : games[0].home_team.full_name} right now! Click <Link to={`/match/${games[0].id}/${games[0].home_team.id}/${games[0].visitor_team.id}/${games[0].home_team.full_name}/${games[0].visitor_team.full_name}`}>here</Link> to see the stats
                  </p>
                ))}
              </div>
            ) : <p></p>}
          </div>
        )}
        <div>
          <Games id={id} />
        </div>
      </>
    )}
  </div>
);
}

export default Team