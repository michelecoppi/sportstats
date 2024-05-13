import React, { useState, useEffect } from 'react';
import Card from './Card';
import axios from 'axios';
import Spinner from '../Spinner';

const Teams = () => {
    const [error, setError] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        const options = {
            method: 'GET',
            url: 'https://api.balldontlie.io/v1/teams',
            params: { page: '0' },
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
    }, []);
     const atlanticTeams = data.data && data.data.filter(team => team.division === "Atlantic");
     const centralTeams = data.data && data.data.filter(team => team.division === "Central");
     const southwestTeams = data.data && data.data.filter(team => team.division === "Southwest");
     const northwestTeams = data.data && data.data.filter(team => team.division === "Northwest");
     const southeastTeams = data.data && data.data.filter(team => team.division === "Southeast");
     const pacificTeams = data.data && data.data.filter(team => team.division === "Pacific");
    
    return (
        <div>
            {!data.data ? <Spinner/> : (
             <>
            <div>
                <h1 className="text-center">Teams</h1>
                <p className="text-center">Here you can see teams informations, click on an image to see a specific team informations </p>
            </div>
            <div>
                <h2 className="text-center">Atlantic</h2>
                <div className="card-group mx-auto" style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap"
                }}>
                {atlanticTeams && atlanticTeams
                        .map((team, i) => {
                          
                            return <Card key={i} team={team} />
                          
                        })}
                </div>
                <h2 className='text-center'>Pacific</h2>
                <div className="card-group mx-auto" style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap"
                }}>
            
                {pacificTeams && pacificTeams
                        .map((team, i) => {
                         
                            return <Card key={i} team={team} />
                          
                        })}
             
                </div>
                <h2 className='text-center'>Northwest</h2>
                <div className="card-group mx-auto" style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap"
                }}>
            
            
                {northwestTeams && northwestTeams
                        .map((team, i) => {
                         
                            return <Card key={i} team={team} />
                          
                        })}
             
                </div>
                <h2 className='text-center'>Central</h2>
                <div className="card-group mx-auto" style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap"
                }}>
            
            
                {centralTeams && centralTeams
                        .map((team, i) => {
                         
                            return <Card key={i} team={team} />
                          
                        })}
             
                </div>
                <h2 className='text-center'>Southwest</h2>
                <div className="card-group mx-auto" style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap"
                }}>
            
            
                {southwestTeams && southwestTeams
                        .map((team, i) => {
                         
                            return <Card key={i} team={team} />
                          
                        })}
             
                </div>
                <h2 className='text-center'>Southeast</h2>
                <div className="card-group mx-auto" style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap"
                }}>
            
            
                {southeastTeams && southeastTeams
                        .map((team, i) => {
                         
                            return <Card key={i} team={team} />
                          
                        })}
             
                </div>
            </div>
            </>
            )}
        </div>
        
    )
}

export default Teams;