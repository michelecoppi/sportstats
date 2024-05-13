import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Players = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchTerm.length > 0) {
      const options = {
        method: 'GET',
        url: 'https://api.balldontlie.io/v1/players',
        params: { search: searchTerm, per_page:'100' },
        headers: {
          Authorization: process.env.REACT_APP_AUTHORIZATION_KEY,
        }
      };
      axios.request(options)
        .then(response => {
          setData(response.data);
          setError('');
        })
        .catch(error => {
          setError("An error has occurred, please try again later");
          console.error(error);
        });
    }
  }, [searchTerm]);

  let filteredPlayers = [];
  if (data.data) {
    filteredPlayers = data.data.filter(player => player.last_name.toLowerCase().includes(searchTerm.toLowerCase()) && player.position !== "");
  }
  return (
    <div>
      <h1 className='text-center'>NBA Players Database</h1>
      <div className='text-center'>
        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search for a player by last name" />
      </div>
      {error && <p>{error}</p>}
      {!searchTerm ?
        <p className='text-center'>Write the last name of the player</p> :
        !data.data || data.data.length === 0 ?
          <p className='text-center'>No player found</p> :
          filteredPlayers.length === 0 ?
            <p className='text-center'>No player found</p> :
            <div className='table-responsive'>
            <table className='table mx-auto table-hover '>
              <thead className='thead-dark'>
                <tr>
                  <th className='text-center'>Name</th>
                  <th className='text-center'>Last Name</th>
                  <th className='text-center'>Position</th>
                  <th className='text-center'>Team</th>
                  <th className='text-center'></th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map(player => (
                  
                  <tr key={player.id}>
                    <td className='text-center'>{player.first_name}</td>
                    <td className='text-center'>{player.last_name}</td>
                    <td className='text-center'>{player.position}</td>
                    <td className='text-center'>{player.team.full_name}</td>
                    <td className='text-center'><Link to={`/player/${player.id}`}><button className='btn btn-primary '>More Info</button></Link></td>
                  </tr>
                  
                ))}
              </tbody>
            </table>
            </div>
      }
    </div>
  );


}

export default Players;