import React, { useState, useEffect } from 'react';
import { onSnapshot, collection, query } from 'firebase/firestore';
import { firestore } from '../../firebase'
import { Avatar } from '@mui/material';
import './style.css'
function Leaderboard() {
    
const [allUsers, setAllUsers] = useState([{ name: 'loading', id: 'initial' }]);
const [weeklyUsers, setWeeklyUsers] = useState([{ name: 'loading', id: 'initial' }]);
const[medals, setMedals] = useState([{ name: 'loading', id: 'initial' }]);
const [week, setWeek] = useState([{ name: 'loading', id: 'initial' }]);
const [leaderboardType, setLeaderboardType] = useState("allTime");

    useEffect(() => {
      const all = onSnapshot(collection(firestore, "users"), (usersSnapshot) => {
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
          
          setAllUsers(sortedUsers);
        });
        const d = usersSnapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .sort((a, b) => b.weeklyPoints - a.weeklyPoints);
        setWeeklyUsers(d);
        const g = usersSnapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .map(medal => {
          let countgold=0;
          let countsilver=0;
          let countbronze=0;
          medal.weeklyMedal.split("").forEach(letter => {
            if (letter === "g") {
              countgold++;
            } else if (letter === "s") {
              countsilver++;
            } else if (letter === "b") {
              countbronze++;
            }
          })
          return {
            ...medal,
            gold: countgold,
            silver: countsilver,
            bronze: countbronze

          };
        });
      setMedals(g);
      });
      
  
      const week = onSnapshot(collection(firestore, "weeklyLeaderboard"), (snapshot) => {
        const d = snapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id }))
         setWeek(d[0]);
      });
      
        return () => {
            all();
            week();
            
           
        };
    }, []);

    function getClassName(index) {
        if (index === 0) {
          return "gold";
        } else if (index === 1) {
          return "silver";
        } else if (index === 2) {
          return "bronze";
        } else {
          return "";
        }
      }


      return (


        <div className="table-responsive">
          <select className="form-select form-select-lg mb-3 select-leaderboard text-center" aria-label=".form-select-lg example" value={leaderboardType} onChange={(e) => setLeaderboardType(e.target.value)}>
              <option value="allTime">Leaderboard all Time</option>
              <option value="weekly">Leaderboard Week</option>
              <option value="medals">Leaderboard Medals</option>
                </select>
                
                {leaderboardType === "allTime" && (

          <table className="table ">
            <thead>
              <tr>
               
                <th>Position</th>
                <th></th>
                <th>Username</th>
                <th>Coins</th>
              </tr>
            </thead>
            <tbody>
              {allUsers
                .slice(0, 10)
                .map((user, index) => (
                  <tr className={getClassName(index)} key={index}>
                    <td >{index + 1}</td>
                    <td><Avatar 
              src={user.profilePic}
              sx={{ width: 30, height: 30 }}
            /></td>
                    <td>{user.username}</td>
                    <td>{user.totalcoins}</td>
                  </tr>
                ))}
              {allUsers.length < 10 &&
                [...Array(10 - allUsers.length)].map((e, i) => (
                  <tr key={i + allUsers.length}>
                    <td>{i + allUsers.length + 1}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
            </tbody>
          </table>
          )}
          {leaderboardType === "weekly" && (
            <div >
             <h1 className='text-center'> Restarting next Season</h1>
              {/* <h5 className="text-center">Week {week.week} {week.starting}-{week.ending}</h5>
              <h5 className="text-center">Top 10 users</h5>
            <table className="table ">
            <thead>
              <tr>
               
                <th>Position</th>
                <th></th>
                <th>Username</th>
                <th>Weekly Points</th>
              </tr>
            </thead>
            <tbody>
              {weeklyUsers
                .sort((a, b) => b.weeklyPoints - a.weeklyPoints)
                .slice(0, 10)
                .map((user, index) => (
                  <tr className={getClassName(index)} key={index}>
                    <td >{index + 1}</td>
                    <td><Avatar 
              src={user.profilePic}
              sx={{ width: 30, height: 30 }}
            /></td>
                    <td>{user.username}</td>
                    <td>{user.weeklyPoints}</td>
                  </tr>
                ))}
              {weeklyUsers.length < 10 &&
                [...Array(10 - weeklyUsers.length)].map((e, i) => (
                  <tr key={i + weeklyUsers.length}>
                    <td>{i + weeklyUsers.length + 1}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
            </tbody>
          </table> */}
          </div>
          )}

          {leaderboardType === "medals" && (
            <div >
              <h5 className="text-center">Top 10 users</h5>
            <table className="table ">
            <thead>
              <tr>
                <td><b>Postion</b></td>
                <td></td>
                <td><b>Username</b></td>
                <td><div className="gold-point"></div></td>
                <td><div className="silver-point"></div></td>
                <td><div className="bronze-point"></div></td>
                </tr>
                </thead>
                <tbody>
                  {medals
                  .sort((a, b) => b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze)
                .slice(0, 10)
                .map((user, index) => (
                  <tr  className={getClassName(index)}  key={index}>
                    <td >{index + 1}</td>
                    <td><Avatar 
              src={user.profilePic}
              sx={{ width: 30, height: 30 }}
            /></td>
                    <td>{user.username}</td>
                    <td>{user.gold}</td>
                    <td>{user.silver}</td>
                    <td>{user.bronze}</td>
                  </tr>
                ))}
              {medals.length < 10 &&
                [...Array(10 - medals.length)].map((e, i) => (
                  <tr key={i + medals.length}>
                    <td>{i + medals.length + 1}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
                  </tbody>
           </table>
                </div>
          )}
        </div>
      );
}

export default Leaderboard