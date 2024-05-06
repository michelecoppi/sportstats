import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import '../pallino.css'
import { UserAuth } from '../context/AuthContext'
import { firestore } from '../firebase'
import { onSnapshot, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { Alert } from '@mui/material';


const MatchInfoE = () => {
  const location = useLocation();
  const { object } = location.state;
  const [bet, setBet] = useState(0)
  const [idBet, setIdBet] = useState([{ name: 'loading', id: 'initial' }]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [idW, setIdW] = useState("1");
  const [coins, setCoins] = useState({})
  const { user } = UserAuth()


  useEffect(() => {
    onSnapshot(collection(firestore, "users"), (snapshot) =>
      (snapshot.docs.map((doc) => doc.data().email === user.email && setCoins(doc.data())))
    );
    onSnapshot(collection(firestore, "users"), (snapshot) => {
      const filteredDocs = snapshot.docs.filter(doc => doc.data().email === user.email);
      if (filteredDocs.length > 0) {
        setIdBet(filteredDocs[0].id);
      }
    });
  }, [])

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

console.log(object)

  const handleSubmit = async (e) => {


    e.preventDefault();
    if (bet == 0 || bet === '' || bet < 0 || bet > (coins.coins) || bet === undefined || bet === null || isNaN(bet)) {
      setErrorMessage('Please enter a valid amount')

    } else {
      try {

        const docRef = doc(firestore, "users", idBet)
        const payload2 = {  coins: ((coins.coins) - bet)}
        const payload = { email: user.email, bet: bet, gameId: `${object.id}`, match: `${object.opponents[0].opponent.name} vs ${object.opponents[1].opponent.name}`, winningTeam: idW, date: "", sport: "esports" }
        await addDoc(collection(firestore, "bet"), payload);
        await updateDoc(docRef, payload2);
        setSuccessMessage('Bet placed')
        document.getElementById("betInput").value = "";
        setBet(0);
      } catch (e) {
        console.log(e)
      }
    }
  }



  return (
    <div className='text-center'>
      {successMessage && (
        <Alert
          className='alert'
          severity="success"
          variant="filled"
          style={{ zIndex: 1000, margin: 10 }}
          onClose={() => setSuccessMessage('')}
        >
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert
          className='alert'
          severity="error"
          style={{ zIndex: 1000, margin: 10 }}
          variant="filled"
          onClose={() => setErrorMessage('')}
        >
          {errorMessage}
        </Alert>
      )}
      <h1 >{object.name.split(":")[0]}</h1>
      <h2>{object.name.split(":")[1]}</h2>
      {object.status === "not_started" ? <h3>{object.begin_at.split("T")[0]}</h3> : object.status === "finished" ? <h3>Game Over</h3> : object.status === "running" ? <h3>Game Running</h3> : object.status === "canceled" ? <h3>Game Canceled</h3> : <h3>Game Postponed</h3>}
      {object.status === "not_started" ? <h3>{object.begin_at.split("T")[1].split("Z")[0]}</h3> : object.status === "finished" ? <h3>{object.end_at.split("T")[0]} {object.end_at.split("T")[1].split("Z")[0]}</h3> : object.status === "running" ? <h3>Live <div className='dot'></div></h3> : object.status === "canceled" ? <h3></h3> : <h3></h3>}
      <>
        {object.opponents.length > 0 ? (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ textAlign: "left", marginLeft: "20px" }}>

                <img src={object.opponents[0].opponent.image_url} style={{ width: "40px", height: "40px" }}></img>
                <h3 style={{ marginBottom: "20px" }}>{object.opponents[0].opponent.acronym}</h3>
                {object.status === "finished" ? <h1>{object.results[0].score}</h1> : <h1></h1>}
              </div>
              <div style={{ textAlign: "right", marginRight: "20px" }} >
                <img src={object.opponents[1].opponent.image_url} style={{ width: "40px", height: "40px" }}></img>
                <h3 style={{ marginBottom: "20px" }}>{object.opponents[1].opponent.acronym}</h3>
                {object.status === "finished" ? <h1>{object.results[1].score}</h1> : <h1></h1>}
              </div>

            </div>
          </>
        ) : (
          <div></div>
        )}
      </>
      <div>
        {object.status === "finished" ? <h3>Winner: {object.results[0].score > object.results[1].score ? object.opponents[0].opponent.name : object.opponents[1].opponent.name}</h3> : <h3></h3>}
        {object.status === "canceled" && object.forfeit ? <h3>Winner: {object.winner_id===object.opponents[0].opponent.id ? object.opponents[0].opponent.name : object.opponents[1].opponent.name}</h3> : <h3></h3>}
      </div>
      <div>
        {object.status === "not_started" && object.opponents.length > 0 ? <div ><div><h1>Bet</h1>
          <select onChange={(e) => setIdW(e.target.value)}>
            <option value="1">{object.opponents[0].opponent.name}</option>
            <option value="2">{object.opponents[1].opponent.name}</option>
          </select>

        </div>
          <div> <input type="number" style={{ marginTop: "20px" }} onChange={(e) => setBet(parseInt(e.target.value))} className="text-center" id="betInput"></input></div>
          <div> <button className="btn btn-warning" style={{ marginTop: "20px" }} onClick={handleSubmit}>Bet</button></div>
        </div> : <div></div>}
      </div>
    </div>
  )
}

export default MatchInfoE