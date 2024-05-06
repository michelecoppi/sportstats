import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Avatar } from '@mui/material';
import './table.css';


const Match = () => {
  const { gameId, homeTeamId, visitorTeamId,homeTeamName,visitorTeamName } = useParams();
  const [players, setPlayers] = useState([]);

  const [openPlayerIndex, setOpenPlayerIndex] = useState(-1);

  useEffect(() => {
    const options = {
      method: 'GET',
      url: 'https://api.balldontlie.io/v1/stats',
      params: { page: '0', per_page: '100', game_ids: [gameId] },
      headers: {
        Authorization: process.env.REACT_APP_AUTHORIZATION_KEY,
      }
    };
    axios.request(options).then(function (response) {

      // console.log(response.data.data)
      setPlayers(response.data.data);

    }).catch(function (error) {
      console.error(error);
    });

  }, []);

  const togglePlayerInfo = (index) => {
    setOpenPlayerIndex(index === openPlayerIndex ? -1 : index);
  };

  const renderPlayerInfo = (player, teamId) => {
    if (player.team.id == teamId) {
      return (
        <React.Fragment key={player.player.id}>
          <PlayerInfo player={player} togglePlayerInfo={togglePlayerInfo} index={player.id} />
          {player.id === openPlayerIndex && (
            <tr>
              <td colSpan="5">
                <div style={{ backgroundColor: '#ddd', padding: '3px' }}>
                  <p className="text-center">
                    FG3: {player.fg3m}/{player.fg3a} FG3%: {Math.round(player.fg3_pct * 100)}
                    <br />
                    FG: {player.fgm}/{player.fga} FG%: {Math.round(player.fg_pct * 100)}
                    <br />
                    FT: {player.ftm}/{player.fta} FT%: {Math.round(player.ft_pct * 100)}
                    <br />
                    OREB: {player.oreb} DREB: {player.dreb} BLK: {player.blk} STL:{' '}
                    {player.stl} TO: {player.turnover}{' '}
                  </p>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    }
  };


  return (
    <div className="container">
    <div className="table-wrapper">
      <div className="table-container" >
        <div className="table-title">
          {homeTeamName}
          <Avatar src={"/images/logo" + homeTeamId + ".png"} sx={{ width: 100, height: 100 }} />
        </div>
        <table className="table table-sm table-responsive table-hover table-bordered">
          <thead className='thead-dark'>
            <tr>
              <th className='text-center'>Name</th>
              <th className='text-center'>Points</th>
              <th className='text-center'>Assists</th>
              <th className='text-center'>Rebounds</th>
              <th className='text-center'>Minutes</th>
            </tr>
          </thead>
          <tbody>
          {players.filter(player => player.min !== "00").sort((a, b) => b.pts - a.pts).map(player => renderPlayerInfo(player, homeTeamId))}
          </tbody>
        </table>
      </div>
     
      <div className="table-container" >
       <div className="table-title">
       <Avatar src={"/images/logo" + visitorTeamId + ".png"} sx={{ width: 100, height: 100 }} />
      {visitorTeamName}
       </div>
        <table className="table table-sm table-responsive table-hover table-bordered">
          <thead className='thead-dark'>
            <tr>
              <th className='text-center'>Name</th>
              <th className='text-center'>Points</th>
              <th className='text-center'>Assists</th>
              <th className='text-center'>Rebounds</th>
              <th className='text-center'>Minutes</th>
            </tr>
          </thead>
          <tbody>
          {players.filter(player => player.min !== "00").sort((a, b) => b.pts - a.pts).map(player => renderPlayerInfo(player, visitorTeamId))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  )
}



const PlayerInfo = (props) => {


  return (

    <tr onClick={() => props.togglePlayerInfo(props.index)}>
      <td className="text-center">
        {props.player.player.first_name} {props.player.player.last_name}
      </td>
      <td className="text-center">{props.player.pts}</td>
      <td className="text-center">{props.player.ast}</td>
      <td className="text-center">{props.player.reb}</td>
      <td className="text-center">{props.player.min}</td>
    </tr>
  );
};

export default Match