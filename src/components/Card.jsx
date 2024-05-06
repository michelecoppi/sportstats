
import React from 'react'
import { Img } from 'react-image'
import { Link } from 'react-router-dom';


const cardStyle = {
  width: "18rem",
  margin: "1rem",
  border: "1px solid gray",
  borderRadius : "10px",
  
};

const Card =(props) =>{
  return (
    <div className="card" style={cardStyle}>
      <Link to={`/team/${props.team.id}`}> <Img src={`images/logo${props.team.id}.png`} className="card-img-top "/></Link>
    <div className="card-body">
      <p className="card-text text-center">{props.team.full_name}</p>
    </div>
  </div>
  )
}

export default Card