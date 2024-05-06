import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { firestore } from '../firebase'
import { useNavigate,useLocation } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext'
import { onSnapshot, collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import Spinner from './Spinner';
import './backbutton.css';




const Bet = () => {
  const { state } = useLocation();
    const id = state && state.id;
    const dateMatch= state && state.data;
  const [idBet, setIdBet] = useState([{ name: 'loading', id: 'initial' }]);
  const [data, setData] = useState([]);
  const [team, setTeam] = useState("1");
  const [coins, setCoins] = useState({});
  const [home, setHome] = useState([]);
  const [away, setAway] = useState([]);
  const [bet, setBet] = useState([]);
  const [error, setError] = useState('');
  const [usersMedals, setUsersMedals] = useState([]);

  const { user } = UserAuth()

  const navigate = useNavigate()



  const handleSubmit = async (e) => {


    e.preventDefault();
    if (bet == 0 || bet === '' || bet < 0 || bet > (coins.coins) || bet === undefined || bet === null || isNaN(bet)) {
      alert('Please enter a valid amount')

    } else {
      try {
        
        const docRef = doc(firestore, "users", idBet)
        const payload2 = { coins: ((coins.coins) - bet)}
        const payload = { email: user.email, bet: bet, gameId: id, match: `${home} vs ${away}`, winningTeam: team, date: dateMatch, sport:"basket" }
        await addDoc(collection(firestore, "bet"), payload);
        await updateDoc(docRef, payload2);
      
        navigate('/matches')
      } catch (e) {
        console.log(e);
      }
    }
  }

 

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const options = {
          method: 'GET',
          url: `https://api.balldontlie.io/v1/games/${id}`,
          headers: {
            Authorization: process.env.REACT_APP_AUTHORIZATION_KEY,
          }
        };

        try {
          const response = await axios.request(options);
          console.log(response.data)
          setAway(response.data.data.visitor_team.full_name);
          setHome(response.data.data.home_team.full_name);
          setData(response.data.data);
          setError('');
        } catch (error) {
          setError("An error has occurred, please try again later");
          console.error(error);
        }

        onSnapshot(collection(firestore, "users"), (snapshot) => {
          const a = snapshot.docs.map((doc) => doc.data().email === user.email && setCoins(doc.data()));
          const filteredDocs = snapshot.docs.filter(doc => doc.data().email === user.email);
          if (filteredDocs.length > 0) {
            setIdBet(filteredDocs[0].id);
          }
          const c = snapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id }))
          .sort((a, b) => b.coins - a.coins);
        setUsersMedals(c);
        });
      };

      fetchData();
    }
  }, [user]);

 const handleBack = () => {
  window.history.back();
}
  
  return (

    <div className='text-center'>
      {Object.keys(coins).length === 0 ? (
        <Spinner></Spinner>
      ) : (
        <div>
          <div className='row align-items-start container-fluid'>
            <div className='col-3'>
           <button className="btn btn-danger btn-back" onClick={handleBack}>Back</button>
           </div>
           <div className='col-6'>
          <h1 >Bet</h1>
          </div>
          </div>
          <p > You are betting in {home} vs {away} match </p>
          <div className='flex flex-col py-2'>
            <label className='py-2 font-medium'>Select the winning team:</label><br></br><br></br>
            <select onChange={(e) => setTeam(e.target.value)} className='border p-3'>
              <option value="1">{home}</option>
              <option value="2">{away}</option>

            </select><br></br><br></br>
            <label className='py-2 font-medium'>Place your bet </label><br></br><br></br>
            <input onChange={(e) => setBet(parseInt(e.target.value))} className='border p-3' type="number" /><br></br><br></br>
            <p className='py-2 font-medium'><b>You have {coins.coins} coins</b></p><br></br><br></br>
            <button onClick={handleSubmit} className='btn btn-secondary  font-bold py-2 px-4 rounded'>Place bet</button>
          </div>

        </div>
      )}
    </div>

  )
}

export default Bet