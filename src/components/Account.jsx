import React, { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { firestore } from '../firebase'
import { onSnapshot, collection, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import axios from 'axios';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Avatar } from '@mui/material';
import { Alert } from '@mui/material';
import './account.css';
import Spinner from './Spinner';



const Account = () => {
  const [coins, setCoins] = useState({});
  const [matches, setMatches] = useState([]);
  const [idBet, setIdBet] = useState([{ name: 'loading', id: 'initial' }]);
  const [allUsers, setAllUsers] = useState([{ name: 'loading', id: 'initial' }]);
  const { user, logout } = UserAuth()
  const [usersMedals, setUsersMedals] = useState([]);
  const [week, setWeek] = useState(false);
 


  const navigate = useNavigate()

  // const checkWeek = async () => {
    
  //    let date = new Date();
  //    let formattedDate = date.toLocaleDateString("en-US", {
  //      month: "2-digit",
  //     day: "2-digit",
  //     year: "numeric"
  //   });

  //   let date2 = new Date(week.ending);

  //   let formattedDate2 = date2.toLocaleDateString("en-US", {
  //     month: "2-digit",
  //     day: "2-digit",
  //     year: "numeric"
  //   });

  //   if (formattedDate2 < formattedDate) {
  //     date2.setDate(date2.getDate() + 7);

  //     formattedDate2 = date2.toLocaleDateString("en-US", {
  //       day: "2-digit",
  //       month: "2-digit",
  //       year: "numeric"
  //     });
  
  //       const updates = usersMedals.map((user, index) => {
  //         const docRef = doc(firestore, "users", user.id);
  //         let payload = {
  //           weeklyPoints: 0,
  //           weeklyMedal: user.weeklyMedal,
  //         };
      
  //         if (index === 0) {
  //           payload = {
  //             weeklyPoints: 0,
  //             weeklyMedal: user.weeklyMedal + " gold" + week.week,
  //           };
  //         } else if (index === 1) {
  //           payload = {
  //             weeklyPoints: 0,
  //             weeklyMedal: user.weeklyMedal + " silver" + week.week,
  //           };
  //         } else if (index === 2) {
  //           payload = {
  //             weeklyPoints: 0,
  //             weeklyMedal: user.weeklyMedal + " bronze" + week.week,
  //           };
  //         }
      
  //         return updateDoc(docRef, payload);
  //       });
      
  //       const leaderboardUpdate = setDoc(
  //         doc(firestore, "weeklyLeaderboard", week.id),
  //         { week: (parseInt(week.week) + 1), ending: formattedDate2, starting: formattedDate }
  //       );
      
  //       await Promise.all([updates, leaderboardUpdate]);
      
      
  //   } else {
    
  //   }
  // }
  // checkWeek();

  useEffect(() => {
    if (user) {
      

      const betSubscription = onSnapshot(collection(firestore, "bet"), snapshot => {
        const filteredMatches = snapshot.docs
          .filter(doc => doc.data().email === user.email)
          .map(doc => ({ ...doc.data(), id: doc.id }));
        setMatches(filteredMatches);
      });
     
      const b = onSnapshot(collection(firestore, "users"), (snapshot) => {
        const c = snapshot.docs
          .filter(doc => doc.data().email !== user.email)
          .map(doc => ({ ...doc.data(), id: doc.id }));
        setAllUsers(c);
        const v= snapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .sort((a, b) => b.weeklyPoints - a.weeklyPoints);
      setUsersMedals(v);
      const filteredDocs = snapshot.docs.filter(doc => doc.data().email === user.email);
      if (filteredDocs.length > 0) {
        setIdBet(filteredDocs[0].id);
      }
      const users =  snapshot.docs.map(doc => {
        if (doc.data().email === user.email) {
          setCoins(doc.data());
        }
      });

      });

      const week = onSnapshot(collection(firestore, "weeklyLeaderboard"), (snapshot) => {
        const d = snapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id }))
         setWeek(d[0]);
      });
      return () => {
        betSubscription();
        b();
        week();
      };
    }
  }, [user]);



  const changeUsername = async () => {

    let input = prompt('Enter your new username');

    if (input === '') {
      setErrorMessage("You have to write something");


    } else if (input === null) {

    } else if (input === undefined || input === NaN) {
      setErrorMessage('Username not valid');
    } else if (input.length > 14) {
      setErrorMessage('Username too long');
    } else if (input.length < 5) {
      setErrorMessage('Username too short');
    } else if (input.includes(' ')) {
      setErrorMessage('Username cannot contain spaces');
    } else if (allUsers.some((user) => user.username === input)) {
      setErrorMessage('Username already taken');

    } else {

      const docRef = doc(firestore, "users", idBet);
      const payload = { username: input}
      updateDoc(docRef, payload);
      setSuccessMessage('Username changed successfully');
    }

  }


  const handleLogout = async () => {
    try {
      await logout()
      navigate('/signin');
      console.log('logout')
    } catch (e) {
      console.log(e)
    }
  }


  const handleBets = async () => {
    let win = coins.coins;
    let weeklyPoints = coins.weeklyPoints;
    const weekStart = new Date(week.starting)
    const weekEnd = new Date(week.ending)
              
    if (matches.length === 0) {
      setErrorMessage('You have no bets');
    } else {
      
      const optionsArray = matches.map((match) => {
        return match.sport === "basket" 
          ? {
              method: 'GET',
              url: `https://api.balldontlie.io/v1/games/${match.gameId}`,
              headers: {
                Authorization: process.env.REACT_APP_AUTHORIZATION_KEY,
              }
            }
          : {
              method: 'GET',
              url: `https://europe-west1-sportstats-42976.cloudfunctions.net/getMatches?id=${match.gameId}`,
            
            };
      });
  
      try {
        const responses = await Promise.all(optionsArray.map((options) => axios.request(options)));
      
        for (let i = 0; i < responses.length; i++) {
          const response = responses[i];
          const match = matches[i];
          if(match.sport === "basket"){
          if (response.data.id == match.gameId && response.data.status === 'Final') {
            if (((match.winningTeam == 1) && (response.data.home_team_score > response.data.visitor_team_score)) || ((match.winningTeam == 2) && (response.data.home_team_score < response.data.visitor_team_score))) {
              
              win += (parseInt(match.bet) * 2);
              
              // if( dateGame >= weekStart && dateGame <= weekEnd){
              // weeklyPoints += (parseInt(match.bet));
              // }else{
              //   alert('The match ' + match.match + ' is not in the current week so you will not get Weekly points')
              // }
              const docRefDel = doc(firestore, 'bet', match.id);
              deleteDoc(docRefDel);
  
              alert('You won ' + match.bet + ' coins from ' + match.match);
            } else {
              const docRefDel = doc(firestore, 'bet', match.id);
              deleteDoc(docRefDel);
  
              alert('You lost ' + match.bet + ' coins from ' + match.match);
            }
          } else {
            alert('The match ' + match.match + ' is not finished yet');
          }

        } else {
             if (response.data.id == match.gameId && response.data.status === 'finished') {
            if (((match.winningTeam == 1) && (response.data.opponents[0].opponent.id==response.data.winner_id)) || ((match.winningTeam == 2) && (response.data.opponents[1].opponent.id==response.data.winner_id))) {
              win+= (parseInt(match.bet) * 2);
              const docRefDel = doc(firestore, 'bet', match.id);
              deleteDoc(docRefDel);
  
              alert('You won ' + match.bet + ' coins from ' + match.match);
            }else if (match.draw){
              win+= parseInt(match.bet);
              const docRefDel = doc(firestore, 'bet', match.id);
              deleteDoc(docRefDel);
              alert('Draw! You got money back from ' + match.match)
            }else{
              const docRefDel = doc(firestore, 'bet', match.id);
              deleteDoc(docRefDel);
  
              alert('You lost ' + match.bet + ' coins from ' + match.match);
            }
             }else if(response.id == match.gameId && response.status === 'canceled'){
              win+= parseInt(match.bet);
              alert('The match ' + match.match + ' was canceled! You got money back');
              const docRefDel = doc(firestore, 'bet', match.id);
              deleteDoc(docRefDel);
             }
             else{
                alert('The match ' + match.match + ' is not finished yet');
             }
        }

        }
    
  
        const payload = {  coins: win , weeklyPoints: weeklyPoints  };
        const docRef = doc(firestore, 'users', idBet);
        await updateDoc(docRef, payload);
      } catch (error) {
        console.error(error);
      }
    }
  };
  

  const goToLeaderBoard = async () => {
    navigate('/leaderboard')

  }
  const handleSubmitPhoto = async (e) => {
    if (e.target.files[0]) {
      if (e.target.files[0].type.startsWith('image/')) {
        if (e.target.files[0].size > 2000000) {
          setErrorMessage('Image too big')
        } else {

          const imageRef = ref(storage, `${user.email}/${e.target.files[0].name}`)
          await uploadBytes(imageRef, e.target.files[0]).then(() => {
            getDownloadURL(imageRef).then((url) => {

              const payload = { profilePic: url }
              const docRef = doc(firestore, "users", idBet);
              updateDoc(docRef, payload);

            }).catch((error) => {
              console.log(error)
            })

          }).catch((error) => {
            console.log(error)
          })
        }
      } else {
        setErrorMessage('Not an image');
      }
    }
  }

const goToPalmares = async () => {
  navigate('/palmares')
}

const goToChat = async () => {
  navigate(`/chat/${coins.username}`, { state: { email: user.email } })
  
}

const goToSearchUsers = async () => {
  navigate(`/searchusers`, { state: { email: user.email } })
}

const goToClan = async () => {
  navigate(`/clan`, { state: { email: user.email } })
}


const [successMessage, setSuccessMessage] = useState('');
const [errorMessage, setErrorMessage] = useState('');


useEffect(() => {
  
  const successTimeout = setTimeout(() => {
    setSuccessMessage('');
  }, 3000);

  
  const errorTimeout = setTimeout(() => {
    setErrorMessage('');
  }, 3000);

  
  return () => {
    clearTimeout(successTimeout);
    clearTimeout(errorTimeout);
  }
}, [successMessage, errorMessage]);

  return (
  
    <div className='text-center'>
      
      {Object.keys(coins).length === 0 ? (
        <Spinner></Spinner>
      ) : (
      
        <div className='text-center'>
          {successMessage && (
        <Alert 
        className='alert'
          severity="success" 
          variant="filled"
          style={{zIndex: 1000, margin:10}}
          onClose={() => setSuccessMessage('')}
        >
          {successMessage}
        </Alert>
      )}

         {errorMessage && (
        <Alert 
        className='alert'
          severity="error" 
          style={{zIndex: 1000, margin:10}}
          variant="filled"  
          onClose={() => setErrorMessage('')}
        >
          {errorMessage}
        </Alert>
      )}
          
          <h1 className=' font-bold py-4'>Account</h1>
          <div className='text-center'>
            <center> <Avatar onClick={() => document.getElementById("fileInput").click()}
              src={coins.profilePic}
              sx={{ width: 150, height: 150 }}
            /></center>
            <input id="fileInput" type="file" style={{ display: "none" }} placeholder="Choose file" onChange={handleSubmitPhoto} /><br></br>

          </div>
          <p >Email: <b>{user && user.email}</b></p>
          <p >Username: <b>{coins.username}</b> </p>

          <p >Coins: <b>{coins.coins}</b></p>
          <p >Weekly points: <b>{coins.weeklyPoints}</b></p>
         
          {matches.length > 0 && (
            <>
              <h2>Your Bets</h2>
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Prediction</th>
                    <th>Match</th>
                    <th>Bet</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match, index) => (
                    <tr key={index}>
                      <td>{match.winningTeam}</td>
                      <td>{match.match}</td>
                      <td>{match.bet}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          <div className="containerProva ">
  <div className="row align-items-start">
    <div className="col-xl-3 col-sm-6 col-6 ">
      <button onClick={handleBets} className='btn btn-warning my-4' style={{width: "150px",height:"100px"}}>Claim bets</button>
    </div>
    <div className="col-xl-3 col-sm-6 col-6 ">
      <button onClick={goToClan} className='btn btn-success  my-4'style={{width: "150px",height:"100px"}}>Clan</button>
    </div>
    <div className="col-xl-3 col-sm-6 col-6 ">
      <button onClick={changeUsername} className='btn btn-info  my-4'style={{width: "150px",height:"100px"}}>Change username</button>
    </div>
    <div className="col-xl-3 col-sm-6 col-6 ">
      <button onClick={goToPalmares} className='btn btn-secondary  my-4'style={{width: "150px",height:"100px"}}>Palmares</button>
    </div>
  </div>
  <div className="row align-items-start">
    <div className="col-xl-3 col-sm-6 col-6 ">
      <button onClick={goToSearchUsers} className='btn btn-dark  my-4'style={{width: "150px",height:"100px"}}>Search users</button>
    </div>
    <div className="col-xl-3 col-sm-6 col-6 ">
      <button onClick={goToChat} className='btn btn-success  my-4'style={{width: "150px",height:"100px"}}>Chat</button>
    </div>
    <div className="col-xl-3 col-sm-6 col-6 ">
      <button onClick={goToLeaderBoard} className='btn btn-primary  my-4'style={{width: "150px",height:"100px"}}>Leaderboard</button>
    </div>
    <div className="col-xl-3 col-sm-6 col-6 ">
      <button onClick={handleLogout} className='btn btn-danger  my-4'style={{width: "150px",height:"100px"}}>Logout</button>
    </div>
  </div>
</div>

        </div>
      )}
            
    </div>

  )
}

export default Account