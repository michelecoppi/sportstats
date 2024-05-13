import React, { useState, useEffect,  } from 'react';
import { firestore } from '../../firebase'
import { onSnapshot, collection, query } from 'firebase/firestore'
import { useParams } from 'react-router-dom'
import { Avatar } from '@mui/material';
import { UserAuth } from '../../context/AuthContext';
import Spinner from '../Spinner';

const ViewAccount =() => {
  const { username } = useParams();

    const [allUsers, setAllUsers] = useState([]);
    const [week, setWeek] = useState([]);
    const [overall, setOverall] = useState([]);
    const[totalcoins, setTotalcoins] = useState([]);
    const { user} = UserAuth();

   

  useEffect(() => {
    if(user){
    const b = onSnapshot(collection(firestore, "users"), (snapshot) => {
        const c = snapshot.docs
          .filter(doc => doc.data().username === username)
          .map(doc => ({ ...doc.data(), id: doc.id }));
        setAllUsers(c);
      });
      const e = onSnapshot(collection(firestore, "users"), (snapshot) => {
        const d = snapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id }))
          .sort((a, b) => b.weeklyPoints - a.weeklyPoints);

        setWeek(d);
      });
      const v = onSnapshot(collection(firestore, "users"), (usersSnapshot) => {
        const users = usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        
       
        const betQuery = query(collection(firestore, "bet"));
        
        onSnapshot(betQuery, (betSnapshot) => {
          const bets = betSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          
       
          const usersWithBets = users.map(user => {
            const bet = bets.filter(bet => bet.email === user.email);
            let betAmount = 0;
            bet.map(bet => betAmount=bet.bet+betAmount)
            
            return {
              ...user,
              totalcoins: user.coins + betAmount
            };
          });
          
          
          const sortedUsers = usersWithBets.sort((a, b) => b.totalcoins - a.totalcoins);
          sortedUsers.map(user  => {
           if (user.username === username) {
               setTotalcoins(user.totalcoins);
           }
          });

          setOverall(sortedUsers);
        });
      });
      
      return ()=> {
        b();
        e();
        v();
      }
    }
  }, [user])
  
const getRank = (a) => {
    let rank = 0;
    if(a==="w"){
    for(let i = 0; i < week.length; i++){
      if(week[i].username === username){
        rank = i + 1;
      }
    }
}else if (a==="o"){
    for(let i = 0; i < overall.length; i++){
        if(overall[i].username === username){
            rank = i + 1;
        }
    }
}

    return rank;
}



  return (
    <div className="text-center">
        {Object.keys(allUsers).length === 0 ? (
        <Spinner/>
      ) : (
        <div>
        <div><h1>Account</h1></div>
        
    <div>
    <center> <Avatar 
              src={allUsers[0].profilePic}
              sx={{ width: 150, height: 150 }}
            /></center>
            </div>
            <br></br>
            <div><p>username: <b>{allUsers[0].username}</b></p>
            <p>coins: <b>{totalcoins}</b></p>
            <p>weekly points: <b>{allUsers[0].weeklyPoints}</b></p>
            <p>Overall Ranking:<b> {getRank("o")}°</b></p>
            <p>Weekly Ranking: <b>{getRank("w")}°</b></p>
            </div>
            </div>
      )}
    </div>
  )
}

export default ViewAccount