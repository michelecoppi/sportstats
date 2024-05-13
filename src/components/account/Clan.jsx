import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { onSnapshot, collection, updateDoc, addDoc, doc, deleteDoc } from 'firebase/firestore'
import { firestore } from '../../firebase.js'
import { Form, Button, Card, Container, CardGroup } from 'react-bootstrap';
import {storage } from '../../firebase.js'
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import Spinner from '../Spinner.jsx'


import { Alert } from '@mui/material';

const Clan = () => {

  const locate = useLocation()
  const email = locate.state.email
  const navigate = useNavigate()
  const [user, setUser] = useState([])
  const [invites, setInvites] = useState([])

  const [clanData, setClanData] = useState([])
  const [openClans, setOpenClans] = useState([])

  const [clanName, setClanName] = useState('');
  const [clanTag, setClanTag] = useState('');
  const [clanDescription, setClanDescription] = useState('');
  const [clanLogo, setClanLogo] = useState(null);
  const [inviteCode, setInviteCode] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showInviteRecived, setInviteRecived] = useState(false);
  const [showClanList, setShowClanList] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);

  const [loading , setLoading] = useState(false);



  function generateRandomString() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 9; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  useEffect(() => {



    const b = onSnapshot(collection(firestore, "users"), (snapshot) => {
      const users = snapshot.docs.map(doc => {
        if (doc.data().email === email) {
          setUser(({ ...doc.data(), id: doc.id }));
        }
      });
      setUserLoaded(true);
    });
    const c = onSnapshot(collection(firestore, "Clans"), (snapshot) => {
      const newClanData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      const openClans = newClanData.filter(clan => clan.type === 'Public');
      setClanData(newClanData);
      setOpenClans(openClans);
    });

    const z = onSnapshot(collection(firestore, "ClansInvites"), (snapshot) => {
      const invites = snapshot.docs.filter(doc => doc.data().email === email).map(doc => ({ ...doc.data(), id: doc.id }));
      setInvites(invites);

    });


    return () => {
      b();
      c();
      z();
    };

  }, [])

  useEffect(() => {

    if (userLoaded && user && user.idClan !== '') {
      navigate('/myclan', { state: { email: email, idClan: user.idClan } })
    }
  }, [userLoaded, user])


  const createClan = async (event) => {
   setLoading(true);
    const date = new Date();
    event.preventDefault();

    const clan = {
      clanName,
      clanTag,
      type: 'Public',
      inviteCode: generateRandomString(),
      clanDescription,
      numberMembers: 1,
      maxMembers: 50,
      idBoss: user.id,
      members: [user.id],
      clanLogo: '',
      creationDate: date.toLocaleDateString(),
    }
    const docRef = await addDoc(collection(firestore, 'Clans'), clan)
    const clanId = docRef.id

    if (clanLogo) {
      const storageRef = ref(storage, `clanLogos/${clanId}`);
      await uploadBytes(storageRef, clanLogo);
      const url = await getDownloadURL(storageRef);
      const docRefClan = doc(firestore, 'Clans', clanId)
      await updateDoc(docRefClan, { clanLogo: url })
    }

    const docRefUser = doc(firestore, 'users', user.id)
    await updateDoc(docRefUser, { idClan: clanId })
    setShowForm(false);
    navigate('/myclan', { state: { email: email, idClan: clanId } })
  }

  const deleteInvite = async (id) => {
    const docRef = doc(firestore, 'ClansInvites', id);
    const newInvites = invites.filter(invite => invite.id !== id);
    await deleteDoc(docRef);
    setInvites(newInvites);
  }

  const deleteAllInvitesPerUser = async (email) => {
    const invitesToDelete = invites.filter(invite => invite.email === email);
    invitesToDelete.map(invite => {
      deleteInvite(invite.id);
    })
  }



  const joinClan = async (idClan) => {

    let find = false;
    let idclan = '';
    let members = [];
    let nMembers = 0;
    let mxMembers = 0;
    let type = '';
    clanData.map(clan => {
      if (idClan === clan.id) {
        find = true;
        idclan = clan.id;
        members = clan.members
        nMembers = clan.numberMembers
        mxMembers = clan.maxMembers
        type = clan.type
      }
    })
    if (!find) {
      setErrorMessage('Wrong invite code')
      setShowJoinForm(false);
    } else {
      if (nMembers >= mxMembers) {
        setErrorMessage('Clan is full');
        setShowJoinForm(false);
        return;
      }
      if (type === "Close") {
        setErrorMessage('Clan is close')
        setShowJoinForm(false)
        return;
      }
      const docRefClan = doc(firestore, 'Clans', idclan)
      await updateDoc(docRefClan, { members: [...members, user.id], numberMembers: nMembers + 1 })
      const docRefUser = doc(firestore, 'users', user.id)
      await updateDoc(docRefUser, { idClan: idclan })
      deleteAllInvitesPerUser(email);
      setShowJoinForm(false);
      navigate('/myclan', { state: { email: email, idClan: idclan } })
    }
  }

  const requestJoinClan = async () => {
    const date = new Date();
    let flag = false;
    let find = false;
    let idClan = '';
    let type = '';
    clanData.map(clan => {
      if (inviteCode === clan.inviteCode) {
        find = true;
        type = clan.type;
        idClan = clan.id;
      }
    })
    if (!find) {
      setErrorMessage('Wrong invite code')
      return;
    }
    if (type === 'Close') {
      setErrorMessage('Clan is close')
      return;
    }
    invites.filter(a => (a.idClan === idClan && a.type === "Request" && a.email === email)).map(a => {
      setErrorMessage('You already sent a request')
      flag = true;
    })
    invites.filter(a => (a.idClan === idClan && a.type === "Invite" && a.email === email)).map(a => {
      setErrorMessage('You already have an invite to join this clan')
      flag = true;
    })

    if (!flag) {
      const invite = {
        idClan,
        email: user.email,
        username: user.username,
        idUser: user.id,
        date: date.toLocaleDateString(),
        type: "Request"
      }
      await addDoc(collection(firestore, 'ClansInvites'), invite)
      setSuccessMessage('Request sent')
    }
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
      {(!showForm && !showJoinForm && !showInviteRecived && !showClanList) && <div><div><h1 >Clans</h1></div>
        <div><Button variant='success' onClick={() => setShowForm(true)}>Create Clan</Button></div>
        <div> <Button variant='primary' onClick={() => setShowJoinForm(true)} className='mt-3'>Join Clan </Button></div>
        <div><Button variant='warning' onClick={() => setInviteRecived(true)} className='mt-3'>Invites Recived</Button></div>
        <div> <Button variant='secondary' onClick={() => setShowClanList(true)} className='mt-3'>Public Clans List</Button></div>
      </div>}

      {showInviteRecived &&
        <Container className="d-flex  align-items-center" style={{ marginTop: '20px' }}>
          <CardGroup>
            {invites.length === 0 ?
              <p>No invites right now</p> :
              invites.filter(a => a.type === "Invite").map((invite) => (
                <Card key={invite.id}>
                  <Card.Title>Invite</Card.Title>
                  <Card.Body>
                    <h3>{invite.clanName}</h3>
                    <Button variant='success' onClick={() => joinClan(invite.idClan)} className='mb-3'>Join Clan</Button>
                    <Button variant='danger' onClick={() => deleteInvite(invite.id)} >Delete Invite</Button>
                  </Card.Body>
                </Card>
              ))
            }
          </CardGroup>

          <Button variant='danger' onClick={() => setInviteRecived(false)} className="mt-3">Back</Button>
        </Container>}

      {showClanList &&
        <Container style={{ marginTop: '20px' }}>
          <CardGroup className="d-flex flex-wrap justify-space-between">
            {openClans.length === 0 ?
              <p>No clans right now</p> :
              openClans.map((clan) => (
                <Card key={clan.id} style={{ width: '300px'}} className='mx-auto col-sm-12 col-md-4'>
                  <Card.Header>Clan</Card.Header>
                  <Card.Title>{clan.clanName}</Card.Title>
                  <Card.Body>
                    <h5>Tag: {clan.clanTag}</h5>
                    <h5>Members: {clan.numberMembers}/{clan.maxMembers}</h5>
                    <h5>Type: {clan.type}</h5>
                    <Button variant='success' onClick={() => joinClan(clan.id)} className='mb-3'>Join Clan</Button>
                  </Card.Body>
                </Card>
              ))
            }
          </CardGroup>

          <Button variant='danger' onClick={() => setShowClanList(false)} className="mt-3">Back</Button>
        </Container>}


      {showJoinForm && <div><Form  >
        <Form.Group >
          <Form.Label>Invite Code</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter invite code'
            value={inviteCode}
            onChange={(event) => setInviteCode(event.target.value)}
            required
            className='mx-auto mb-3'
          />
        </Form.Group>
        <Button variant='danger' onClick={() => setShowJoinForm(false)} >
          Cancel
        </Button>
        <Button variant='primary' className='ms-5' onClick={requestJoinClan}>
          Join Clan
        </Button>

      </Form></div>}


      {(showForm && !loading) && <Form onSubmit={createClan} >
        <Form.Group >
          <Form.Label>Clan Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter clan name'
            value={clanName}
            onChange={(event) => setClanName(event.target.value)}
            minLength={4}
            maxLength={16}
            required
            className='mx-auto'
          />
        </Form.Group>
        <Form.Group >
        <Form.Label>Clan Logo</Form.Label>
        <Form.Control
          type="file"
          id="inputGroupFile01"
          label={clanLogo ? clanLogo.name : "Choose file"}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file && file.size > 2 * 1024 * 1024) {
              setErrorMessage("The file size exceeds the limit of 2 MB.");
            } else {
              setClanLogo(file);
            }
          }}
          className='mx-auto'
          custom
          accept="image/*"
        />
      </Form.Group>

        <Form.Group >
          <Form.Label>Clan Tag</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter clan tag'
            value={clanTag}
            onChange={(event) => setClanTag(event.target.value)}
            minLength={1}
            maxLength={3}
            required
            className='mx-auto'
          />
        </Form.Group>
        
        <Form.Group >
          <Form.Label>Clan Description</Form.Label>
          <Form.Control
            as='textarea'
            rows={3}
            placeholder='Enter clan description'
            value={clanDescription}
            onChange={(event) => setClanDescription(event.target.value)}
            maxLength={100}
            required
            className='mx-auto mb-3'
          />
        </Form.Group>
        <Button variant='danger' onClick={() => setShowForm(false)} >
          Cancel
        </Button>
        <Button variant='success' type='submit' className='ms-5'>
          Create Clan
        </Button>

      </Form>}

      {loading && <div className='text-center'>
        <Spinner/>
      </div>}

    </div>


  )
}

export default Clan