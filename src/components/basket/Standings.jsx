import React, { useState, useEffect } from 'react'
import Spinner from '../Spinner'
import './standings.css'


const Standings = () => {
    const [teamsWestern, setTeamsWestern] = useState([])
    const [teamsEastern, setTeamsEastern] = useState([])
    const [players, setPlayers] = useState([])
    const [playersType, setPlayersType] = useState("minutes")
    const [leaderboardType, setLeaderboardType] = useState("Teams");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStandingsData = async () => {
            try {
                const response = await fetch(
                    `https://europe-west1-sportstats-42976.cloudfunctions.net/getStandings`
                );
                const standings = await response.json();
                const stand = JSON.parse(standings.standings);
                const players = JSON.parse(standings.leaders)
                setPlayers(players)

                if (stand) {
                    // Svuota gli array prima di riempirli
                    setTeamsWestern([]);
                    setTeamsEastern([]);

                    // Utilizza un unico map per ciascun array
                    stand.conferences[0].divisions.forEach((division) => {
                        division.teams.forEach((team) => {
                            setTeamsWestern((teams) => [...teams, team]);
                        });
                    });
                    stand.conferences[1].divisions.forEach((division) => {
                        division.teams.forEach((team) => {
                            setTeamsEastern((teams) => [...teams, team]);
                        });
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error('Errore nel caricamento dei dati:', error);
                setLoading(false);
            }
        };

        fetchStandingsData();
    }, []);



    return (
        <div>
            {loading ? <Spinner /> :
                <div>
                    <select className="form-select form-select-lg mb-3 select-leaderboard text-center" aria-label=".form-select-lg example" value={leaderboardType} onChange={(e) => setLeaderboardType(e.target.value)}>
                        <option value="Teams">Teams</option>
                        <option value="Players">Players</option>
                    </select>
                    {leaderboardType === "Teams" && (
                        <div>
                            <h1 className='text-center'>Standings</h1>
                            <div className="container" style={{ display: "flex" }}>
                                <div className="row">
                                    <div className="col-12">
                                        <h2 className='text-center'>Western Conference</h2>
                                        <table className="table table-bordered table-responsive" style={{ width: "100%", marginRight: 20 }}>
                                            <caption className="text-center">
                                                Playoff <span className="squarePlayoff" style={{ marginRight: "10px" }}></span>
                                                Playin <span className="squarePlayin"></span>
                                            </caption>
                                            <thead>
                                                <tr>
                                                    <th scope="col">Team</th>
                                                    <th scope="col">W</th>
                                                    <th scope="col">L</th>
                                                    <th scope="col">PCT</th>
                                                    <th scope="col">STREAK</th>
                                                </tr>
                                            </thead>
                                            <tbody className='tbody-standings'>
                                                {teamsWestern.sort((a, b) => a.calc_rank.conf_rank - b.calc_rank.conf_rank).map((team) => (
                                                    <tr key={team.id} className='tr-standings'>
                                                        <td>{team.market} {team.name}</td>
                                                        <td>{team.wins}</td>
                                                        <td>{team.losses}</td>
                                                        <td>{team.win_pct.toFixed(3)}</td>
                                                        <td>{team.streak.length} {team.streak.kind}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="col-12">
                                        <h2 className='text-center'>Eastern Conference</h2>
                                        <table className="table table-bordered table-responsive" >
                                            <caption className="text-center">
                                                Playoff <span className="squarePlayoff" style={{ marginRight: "10px" }}></span>
                                                Playin <span className="squarePlayin"></span>
                                            </caption>
                                            <thead>
                                                <tr >
                                                    <th scope="col">Team</th>
                                                    <th scope="col">W</th>
                                                    <th scope="col">L</th>
                                                    <th scope="col">PCT</th>
                                                    <th scope="col">STREAK</th>
                                                </tr>
                                            </thead>
                                            <tbody className='tbody-standings'>
                                                {teamsEastern.sort((a, b) => a.calc_rank.conf_rank - b.calc_rank.conf_rank).map((team) => (
                                                    <tr key={team.id} className='tr-standings'>
                                                        <td>{team.market} {team.name}</td>
                                                        <td>{team.wins}</td>
                                                        <td>{team.losses}</td>
                                                        <td>{team.win_pct.toFixed(3)}</td>
                                                        <td>{team.streak.length} {team.streak.kind}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>)}

                    {leaderboardType === "Players" && (
                        <div>
                            <h1 className='text-center'>Leaders</h1>
                            <select className="form-select form-select-lg mb-3 select-leaderboard text-center" aria-label=".form-select-lg example" value={playersType} onChange={(e) => setPlayersType(e.target.value)}>
                                <option value="minutes">Minutes</option>
                                <option value="rebounds">Rebounds</option>
                                <option value="assists">Assists</option>
                                <option value="steals">Steals</option>
                                <option value="blocks">Blocks</option>
                                <option value="points">Points</option>
                            </select>
                            <div className="container" style={{ display: "flex" }}>
                                <div className="row">
                                    <div className="col-12">
                                        {playersType === "minutes" && (
                                            <table className="table table-bordered table-responsive" style={{ width: "100%", marginRight: 20 }}>
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Rank</th>
                                                        <th scope="col">Player</th>
                                                        <th scope="col">Team</th>
                                                        <th scope="col">Minutes</th>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    {players.categories[0].ranks.map((player) => (
                                                        <tr key={player.player.id} >
                                                            <td>{player.rank}</td>
                                                            <td>{player.player.first_name} {player.player.last_name}</td>
                                                            <td>{player.teams[0].market} {player.teams[0].name}</td>
                                                            <td>{player.score}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                        )}
                                        {playersType === "rebounds" && ( 
                                            <table className="table table-bordered table-responsive" style={{ width: "100%", marginRight: 20}}>
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Rank</th>
                                                        <th scope="col">Player</th>
                                                        <th scope="col">Team</th>
                                                        <th scope="col">Rebounds</th>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    {players.categories[17].ranks.map((player) => (
                                                        <tr key={player.player.id} >
                                                            <td>{player.rank}</td>
                                                            <td>{player.player.first_name} {player.player.last_name}</td>
                                                            <td>{player.teams[0].market} {player.teams[0].name}</td>
                                                            <td>{player.score}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                        {playersType === "assists" && ( 
                                            <table className="table table-bordered table-responsive" style={{ width: "100%", marginRight: 20 }}>
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Rank</th>
                                                        <th scope="col">Player</th>
                                                        <th scope="col">Team</th>
                                                        <th scope="col">Assists</th>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    {players.categories[2].ranks.map((player) => (
                                                        <tr key={player.player.id} >
                                                            <td>{player.rank}</td>
                                                            <td>{player.player.first_name} {player.player.last_name}</td>
                                                            <td>{player.teams[0].market} {player.teams[0].name}</td>
                                                            <td>{player.score}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                        {playersType === "steals" && (
                                            <table className="table table-bordered table-responsive" style={{ width: "100%", marginRight: 20 }}>
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Rank</th>
                                                        <th scope="col">Player</th>
                                                        <th scope="col">Team</th>
                                                        <th scope="col">Steals</th>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    {players.categories[4].ranks.map((player) => (
                                                        <tr key={player.player.id} >
                                                            <td>{player.rank}</td>
                                                            <td>{player.player.first_name} {player.player.last_name}</td>
                                                            <td>{player.teams[0].market} {player.teams[0].name}</td>
                                                            <td>{player.score}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                        {playersType === "blocks" && (
                                            <table className="table table-bordered table-responsive" style={{ width: "100%", marginRight: 20 }}>
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Rank</th>
                                                        <th scope="col">Player</th>
                                                        <th scope="col">Team</th>
                                                        <th scope="col">Blocks</th>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    {players.categories[5].ranks.map((player) => (
                                                        <tr key={player.player.id} >
                                                            <td>{player.rank}</td>
                                                            <td>{player.player.first_name} {player.player.last_name}</td>
                                                            <td>{player.teams[0].market} {player.teams[0].name}</td>
                                                            <td>{player.score}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                        {playersType === "points" && (
                                            <table className="table table-bordered table-responsive" style={{ width: "100%", marginRight: 20 }}>
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Rank</th>
                                                        <th scope="col">Player</th>
                                                        <th scope="col">Team</th>
                                                        <th scope="col">Points</th>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    {players.categories[1].ranks.map((player) => (
                                                        <tr key={player.player.id} >
                                                            <td>{player.rank}</td>
                                                            <td>{player.player.first_name} {player.player.last_name}</td>
                                                            <td>{player.teams[0].market} {player.teams[0].name}</td>
                                                            <td>{player.score}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}


                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            }
        </div>
    )
}

export default Standings