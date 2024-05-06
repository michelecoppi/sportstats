import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Nations from './Nations'

const TeamEsports = () => {
    const { team } = useLocation().state
    const navigate = useNavigate()
    const goToPlayer = (id) => {
        navigate(`/playerE/${id}`)
    }

    console.log(team)
    return (
        <div className='text-center'><h1>{team.name}</h1>
            <img src={team.image_url} style={{ width: '200px', height: '200px' }}></img>
            <p>Location: <Nations prefix={team.location} /></p>
            <p>Videogame: {team.current_videogame.name}</p>
           
            {team.players.length > 0 ? (
                <div>
                     <h3>Players</h3>
                <table className='table table-responsive'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nickname</th>
                            <th>Age</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {team.players.map((player) => (
                            <tr key={player.id}>
                                <th><img src={player.image_url} style={{ width: '50px', height: '50px' }}></img></th>
                                <th>{player.name}</th>
                                <th>{player.age}</th>
                                <th><button onClick={() => goToPlayer(player.id)} className='btn btn-primary'>view Player</button></th>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            ):(
                <div>
                    <h3>No players</h3>
                    </div>)}

        </div>

    )
}

export default TeamEsports