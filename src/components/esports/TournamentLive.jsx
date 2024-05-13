import React, { useState, useEffect } from 'react'
import { useParams, useNavigate,useLocation } from 'react-router-dom';

function TournamentLive() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [data, setData] = useState([]);

    useEffect(() => {

        fetch(`https://europe-west1-sportstats-42976.cloudfunctions.net/getTournamentsMatches?id=${id}`)
            .then(response => response.json())
            .then(response => setData(response))
            .catch(err => console.error(err));
    }, [])
    
    const handleInfo = (match) => {

        navigate('/matche', { state: { object: match } });
    };

    return (
      
        <div>
            
              <div className='text-center'> <h1 >Info</h1>
                <p> Start: {data[0] && data[0].tournament.begin_at}</p>
            <p> Tier: {data[0] && data[0].tournament.tier}</p>

              </div>
            <h1 className='text-center'>Matches</h1>
            <div className='flex flex-wrap'>
                {data.sort((a, b) => {
                    
                    if (!a.begin_at) {
                        return 1;
                    }
                    if (!b.begin_at) {
                        return -1;
                    }

                   
                    const dateA = new Date(a.begin_at);
                    const dateB = new Date(b.begin_at);
                    if (dateA > dateB) {
                        return -1;
                    }
                    if (dateA < dateB) {
                        return 1;
                    }
                    return 0;
                }).filter(match => !(match.status === "canceled" && match.forfait === false)).map((match) => (
                    <div className='card col-12 text-center' key={match.id}>
                        <div className='card-header'>
                            <h5>{match.name.split(":")[0]}</h5>
                        </div>
                        <div className="card-text">
                            {match.status === "finished" && match.opponents.length ===2 ?
                                <p>{match.results[0].score} <img src={match.opponents[0].opponent.image_url} style={{ width: "20px", height: "20px" }}></img> {match.opponents[0].opponent.name} vs {match.opponents[1].opponent.name} <img src={match.opponents[1].opponent.image_url} style={{ width: "20px", height: "20px" }}></img> {match.results[1].score}</p>
                                :
                                match.status === "not_started" &&  match.opponents.length ===2  ? <p><img src={match.opponents[0].opponent.image_url} style={{ width: "20px", height: "20px" }}></img> {match.opponents[0].opponent.name} vs {match.opponents[1].opponent.name} <img src={match.opponents[1].opponent.image_url} style={{ width: "20px", height: "20px" }}></img></p>
                                    :
                                    match.forfeit ?
                                    <p></p>
                                    :
                                    <p>TBD vs TBD</p>
                            }



                        </div>
                       <center> <div className='btn btn-primary' type="button" style={{marginBottom:"10px", width:"30%" , maxWidth:"250px"}} onClick={() => handleInfo(match)}>view Game</div></center>
                        <div className='card-footer'>
                            {match.status === 'finished' && 'Final'}
                            {match.forfeit === true && 'Forfait'}
                            {match.status === 'not_started' && `Starting time: ${new Date(match.begin_at).toLocaleDateString()} ${' '}
                            ${new Date(match.begin_at).toLocaleTimeString().slice(0, -3)}`}
                        </div>
                    </div>
                ))}
            </div>
             
        </div>
    )
}

export default TournamentLive