import React, { useState, useEffect } from 'react';
import {firestore} from '../firebase'
import { onSnapshot,collection } from 'firebase/firestore'
import { UserAuth } from '../context/AuthContext'
import { Avatar, Grid } from '@mui/material';
import Spinner from './Spinner';





function Palmares() {

const {user,} = UserAuth()
const [coins, setCoins] = useState([])
const [id, setId] = useState([])

 useEffect(() => {
  if (user){
    const a = onSnapshot(collection(firestore, "users"), (snapshot) => {
      const filteredDocs = snapshot.docs.filter(doc => doc.data().email === user.email);
      if (filteredDocs.length > 0) {
        setId(filteredDocs[0].id);
      }

    });
  const b= onSnapshot(collection(firestore, "users"), snapshot => {
    snapshot.docs.map(doc => {
      if (doc.data().email === user.email) {
        setCoins(doc.data());
      }
    });


  });
    return () => {
    a();
    b();
    }

  }

 }, [user])

 const returnMedals = () => {
  if (!coins.weeklyMedal || typeof coins.weeklyMedal !== 'string') {
    return (
      <div><h1 className="text-center">Your Palmares is empty </h1></div>
    )
  }
  else {
    const medals = coins.weeklyMedal.trim().split(" ");
    return (
      <div>
        <h1>Your Palmares</h1>
        {medals.map((medal, index) => {
          let medalType = medal[0]; // g, s, or b
          let medalSeason = medal.substring(medal.length-1); // season number
          let medalImgSrc = `/images/medals/${medalType}.png`;
        
          return (
            <Grid container key={index} justifyContent="center" alignItems="center" spacing={1} marginTop={3}>
            <Grid item >
              <Avatar src={medalImgSrc} sx={{ width: 30, height: 30}} />
            </Grid>
            <Grid item >
              <span>{`Season ${medalSeason}`}</span>
            </Grid>
          </Grid>
          );
        })}
      </div>
    );
  }
 }

  return (
  
    <div className="flex flex-col items-center text-center">
       {Object.keys(coins).length === 0 ? (
        <Spinner  />
      ) : (
        <div>
      {returnMedals()}
      </div>
      )}
    </div>
    
  )
}

export default Palmares