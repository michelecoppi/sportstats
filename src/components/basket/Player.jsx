import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../Spinner.jsx';
import axios from 'axios';

const Player = () => {
    const { id } = useParams();
    const [data, setData] = useState({});
    const [game, setGame] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const playerResponse = await axios.get(`https://api.balldontlie.io/v1/players/${id}`, {
                    headers: {
                        Authorization: process.env.REACT_APP_AUTHORIZATION_KEY,
                    }
                });
                const statsResponse = await axios.get('https://api.balldontlie.io/v1/stats', {
                    params: { seasons: ['2023'], per_page: '100', player_ids: [id] },
                    headers: {
                        Authorization: process.env.REACT_APP_AUTHORIZATION_KEY,
                    }
                });

                const playerData = playerResponse.data.data;
                const games = statsResponse.data.data.filter(game => game.game.status === "Final" && game.min !== "00");
                games.sort((a, b) => new Date(b.game.date) - new Date(a.game.date));
                const recentGames = games.slice(0, 3);

                setData(playerData);
                setGame(recentGames);
                setError('');
            } catch (error) {
                setError("An error has occurred, please try again later");
                console.error(error);
            } finally {
                setLoading(false);
            }
            
        };

        fetchData();
    }, [id]);

    return (
        <div>
              {loading ? (
        <Spinner />
      ) : (
        <>
        <div>
            <div>
                <p className="text-center text-3xl font-bold text-gray-800">First Name: {data.first_name}</p>
                <p className="text-center text-3xl font-bold text-gray-800">Last Name: {data.last_name}</p>
                <p className="text-center text-3xl font-bold text-gray-800">Position: {data.position}</p>
                <p className="text-center text-3xl font-bold text-gray-800">Country: {data.country}</p>
            </div>
            <div>
                <h3 className="text-center">Last 3 Games stats</h3>
                <table className='table mx-auto table-hover '>
                    <thead className='thead-dark'>
                        <tr>
                            <th className='text-center'>Points</th>
                            <th className='text-center'>Rebounds</th>
                            <th className='text-center'>Assists</th>
                        </tr>
                    </thead>
                    <tbody>
                        {game.map(game => (
                            <tr key={game.id}>
                                <td className='text-center'>{game.pts}</td>
                                <td className='text-center'>{game.reb}</td>
                                <td className='text-center'>{game.ast}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </>
        )}
    </div>
    );
};

export default Player;
