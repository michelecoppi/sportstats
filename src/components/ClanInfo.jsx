import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { onSnapshot, collection, doc, updateDoc, getDocs, deleteDoc, addDoc, getDoc, where, query } from 'firebase/firestore'
import { firestore } from '../firebase'
import { Button, Card, Container, Table, Form, CardGroup } from 'react-bootstrap';
import { Alert, Avatar } from '@mui/material';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase'
import Spinner from './Spinner'

const ClanInfo = () => {
  const locate = useLocation()
  const email = locate.state.email
  const clanId = locate.state.idClan
  const navigate = useNavigate()

  const [showInfo, setShowInfo] = useState(true)
  const [showClanMembers, setShowClanMembers] = useState(false)
  const [showClanSettings, setShowSettings] = useState(false)
  const [showClanInvites, setShowClanInvites] = useState(false)

  const [changeClanName, setChangeClanName] = useState(false)
  const [changeClanTag, setChangeClanTag] = useState(false)
  const [changeClanDescription, setChangeClanDescription] = useState(false)
  const [changeClanType, setChangeClanType] = useState(false)
  const [changeClanLogo, setChangeClanLogo] = useState(false)
  const [invitesSent, setinvitesSent] = useState([])
  const [invitesReceived, setinvitesReceived] = useState([])
  const [allInvites, setAllInvites] = useState([])


  const [newClanName, setNewClanName] = useState('')
  const [newClanTag, setNewClanTag] = useState('')
  const [newClanDescription, setNewClanDescription] = useState('')
  const [newClanType, setNewClanType] = useState('Public')
  const [newClanLogo, setNewClanLogo] = useState(null)

  const [usernameInvite, setUsernameInvite] = useState('')

  const [user, setUser] = useState([])
  const [clan, setClan] = useState([])
  const [users, setUsers] = useState([])
  const [clanMembers, setClanMembers] = useState([])

  const [uploadPhoto, setUploadPhoto] = useState(false)

  function generateRandomString() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 9; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }


  const deleteInvite = async (id) => {
    const inviteRef = doc(firestore, "ClansInvites", id);
    await deleteDoc(inviteRef);
  }

  const deleteAllInvitesPerUser = async (email) => {
    const invitesToDelete = allInvites.filter(invite => invite.email === email);
    invitesToDelete.map(invite => {
      deleteInvite(invite.id);
    })
  }

  const deleteAllInvitesPerClan = async (idClan) => {
    const invitesToDelete = allInvites.filter(invite => invite.idClan === idClan);
    invitesToDelete.map(invite => {
      deleteInvite(invite.id);
    })
  }


  const handleAcceptInvite = async (invite) => {

    const userRef = doc(firestore, "users", invite.idUser);


    await updateDoc(userRef, { idClan: invite.idClan });

    const clanRef = doc(firestore, "Clans", invite.idClan);
    const clanDoc = await getDoc(clanRef);
    const clanData = clanDoc.data();
    const newMembers = clanData.members;
    newMembers.push(invite.idUser);
    const newNumberMembers = newMembers.length;
    await updateDoc(clanRef, {
      members: newMembers,
      numberMembers: newNumberMembers,
    });

    deleteAllInvitesPerUser(invite.email);

  };

  const handleDeclineInvite = async (invite) => {
    const inviteRef = doc(firestore, "ClansInvites", invite.id);
    await deleteDoc(inviteRef);
  };


  const handleLeave = async () => {
    const confirmed = window.confirm("Are you sure you want to leave this clan?");
    if (!confirmed) {
      return;
    }

    const userRef = doc(firestore, "users", user.id);
    await updateDoc(userRef, { idClan: "" });

    const clanRef = doc(firestore, "Clans", clanId);
    const clanDoc = await getDoc(clanRef);
    const clanData = clanDoc.data();

    const newMembers = clanData.members.filter((member) => member !== user.id);
    const newNumberMembers = newMembers.length;

    if (clanData.idBoss === user.id) {

      if (newNumberMembers === 0) {

        await deleteDoc(clanRef);
        if (clanData.clanLogo) {
          const storageRef = ref(storage, clanData.clanLogo);
          await deleteObject(storageRef);
        }

        deleteAllInvitesPerClan(clanId);
        await updateDoc(userRef, { idClan: "" });
      } else {

        const newBossId = newMembers[0];
        await updateDoc(clanRef, {
          idBoss: newBossId,
          members: newMembers,
          numberMembers: newNumberMembers,
        });
      }
    } else {

      if (newNumberMembers === 0) {

        await deleteDoc(clanRef);
        if (clanData.clanLogo) {
          const storageRef = ref(storage, clanData.clanLogo);
          await deleteObject(storageRef);
        }
        deleteAllInvitesPerClan(clanId);
        await updateDoc(userRef, { idClan: "" });
      } else {
        await updateDoc(clanRef, {
          members: newMembers,
          numberMembers: newNumberMembers,
        });
      }
    }

    navigate(`/clan`, { state: { email: user.email } });
  };

  const showMembers = () => {
    setShowInfo(false)
    setShowClanMembers(true)
  }

  const showInfoClan = () => {
    setShowInfo(true)
    setShowClanMembers(false)
  }

  const showInfoInvites = () => {
    setShowInfo(true)
    setShowClanInvites(false)
  }

  const showSettings = () => {
    if (user.id === clan.idBoss) {
      setShowInfo(false)
      setShowSettings(true)
    } else {
      setErrorMessage("You are not the boss of this clan.")
    }
  }

  const showInvites = () => {
    if (user.id === clan.idBoss) {
      setShowInfo(false)
      setShowClanInvites(true)
    } else {
      setErrorMessage("You are not allowed to invite people to this clan.")
    }
  }

  const showInfoClanSettings = () => {
    setChangeClanDescription(false)
    setChangeClanName(false)
    setChangeClanTag(false)
    setChangeClanType(false)
    setShowInfo(true)
    setShowSettings(false)

  }

  const handleChangeClanName = () => {
    setChangeClanName(true)
  }

  const handleChangeClanTag = () => {
    setChangeClanTag(true)
  }

  const handleChangeClanDescription = () => {
    setChangeClanDescription(true)
  }
  const handleChangeClanType = () => {
    setChangeClanType(true)
  }
  const handleChangeClanLogo = () => {
    setChangeClanLogo(true)
  }

  const handleCloseChangeClanName = () => {
    setChangeClanName(false)
  }
  const handleCloseChangeClanTag = () => {
    setChangeClanTag(false)
  }
  const handleCloseChangeClanDescription = () => {
    setChangeClanDescription(false)
  }
  const handleCloseChangeClanType = () => {
    setChangeClanType(false)
  }
  const handleCloseChangeClanLogo = () => {
    setChangeClanLogo(false)
  }



  const handleGenerateInviteCode = () => {
    const inviteCode = generateRandomString();
    const clanRef = doc(firestore, "Clans", clanId);
    updateDoc(clanRef, { inviteCode: inviteCode });
  }


  const handleTypeChange = () => {
    const clanRef = doc(firestore, "Clans", clanId);
    updateDoc(clanRef, { type: newClanType });
    setSuccessMessage("Clan type changed successfully.");
    setChangeClanType(false)
  }

  const handleLogoChange = async () => {
    if (newClanLogo) {
      setUploadPhoto(true)
      const storageRef = ref(storage, newClanLogo.name);
      await uploadBytes(storageRef, newClanLogo);
      const url = await getDownloadURL(storageRef);
      const clanRef = doc(firestore, "Clans", clanId);
      await updateDoc(clanRef, { clanLogo: url });
      setUploadPhoto(false)
      setSuccessMessage("Clan logo changed successfully.");
      setChangeClanLogo(false)
    } else {
      setErrorMessage("Please select a file.");
    }
  }


  const handleDescriptionChange = () => {
    if (newClanDescription.length > 100) {
      setErrorMessage("Clan description should be less than 100 characters long.");
      setChangeClanDescription(false)
      return;
    }
    const clanRef = doc(firestore, "Clans", clanId);
    updateDoc(clanRef, { clanDescription: newClanDescription });
    setSuccessMessage("Clan description changed successfully.");
    setChangeClanDescription(false)
  }

  const handleTagChange = () => {
    if (newClanTag.length < 2 || newClanTag.length > 3) {
      setErrorMessage("Clan tag should be between 2 and 3 characters long.");
      setChangeClanTag(false)
      return;
    }
    const clanRef = doc(firestore, "Clans", clanId);
    updateDoc(clanRef, { clanTag: newClanTag });
    setSuccessMessage("Clan tag changed successfully.");
    setChangeClanTag(false)
  }

  const handleNameChange = () => {
    if (newClanName.length < 4 || newClanName.length > 16) {
      setErrorMessage("Clan name should be between 4 and 16 characters long.");
      setChangeClanName(false)
      return;
    }
    const clanRef = doc(firestore, "Clans", clanId);
    updateDoc(clanRef, { clanName: newClanName });
    setSuccessMessage("Clan name changed successfully.");
    setChangeClanName(false)
  }

  const handleInvite = async () => {
    const date = new Date();
    const userQuerySnapshot = await getDocs(
      query(collection(firestore, "users"), where("username", "==", usernameInvite))
    );
    if (userQuerySnapshot.empty) {
      setErrorMessage("User not found.");
      return;
    }
    const userDoc = userQuerySnapshot.docs[0];
    const userId = userDoc.id;
    const userEmail = userDoc.data().email;

    const isInAClan = !!userDoc.data().idClan;
    if (isInAClan) {
      setErrorMessage("This user is already in a clan");
      return;
    }

    const isInviteSent = invitesSent.some((invite) => invite.idClan === clanId && invite.email === userEmail);
    if (isInviteSent) {
      setErrorMessage("Invite already sent to this user.");
      return;
    }

    const inviteClanRef = collection(firestore, "ClansInvites");
    const payload = {
      idClan: clanId,
      email: userEmail,
      clanName: clan.clanName,
      date: date.toLocaleDateString(),
      type: "Invite",
    };
    await addDoc(inviteClanRef, payload);
    setSuccessMessage("Invite sent to " + usernameInvite + "!");
    setUsernameInvite("");
  };



  useEffect(() => {



    const b = onSnapshot(collection(firestore, "users"), (snapshot) => {
      const clanMembersArr = [];
      const users = snapshot.docs.map(doc => {
        if (doc.data().email === email) {
          setUser(({ ...doc.data(), id: doc.id }));
        }
        if (doc.data().idClan === clanId) {
          clanMembersArr.push(({ ...doc.data(), id: doc.id }))
        }
        if (doc.data().email !== email) {
          setUsers(users => [...users, ({ ...doc.data(), id: doc.id })])
        }
      });
      setClanMembers(clanMembersArr)
    });
    const c = onSnapshot(collection(firestore, "Clans"), (snapshot) => {
      const clans = snapshot.docs.map(doc => {

        if (doc.id == clanId) {
          setClan(doc.data())
        }
      });
    });
    const d = onSnapshot(collection(firestore, "ClansInvites"), (snapshot) => {
      const invites = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      const clanInvites = invites.filter(a => a.idClan === clanId);
      setAllInvites(invites)
      const invitesSent = clanInvites.filter(a => a.type === "Invite");
      setinvitesSent(invitesSent)
      const invitesReceived = clanInvites.filter(a => a.type === "Request");
      setinvitesReceived(invitesReceived)

    });

    return () => {
      b();
      c();
      d();
    };

  }, [])

  const handleKickPlayer = async (id) => {
    if (clan.idBoss !== user.id) {
      setErrorMessage("You are not the boss. You can't kick anyone.")
      return;
    }
    if (id === clan.idBoss) {
      setErrorMessage("You can't kick yourself.")
      return;
    }


    const userRef = doc(firestore, "users", id);
    await updateDoc(userRef, { idClan: "" });
    const clanRef = doc(firestore, "Clans", clanId);
    await updateDoc(clanRef, { numberMembers: clan.numberMembers - 1, members: clanMembers.filter(a => a.id !== id) });

  }

  const handlePromoteToBoss = async (id) => {
    const confirmed = window.confirm("Are you sure you want to promote this player to boss?");
    if (!confirmed) {
      return;
    }
    if (clan.idBoss !== user.id) {
      setErrorMessage("You are not the boss. You can't promote anyone.")
      return;
    }
    if (id === clan.idBoss) {
      setErrorMessage("You are already the boss.")
      return;
    }


    const clanRef = doc(firestore, "Clans", clanId);
    await updateDoc(clanRef, { idBoss: id });
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
      {showInfo &&
        <Container className="d-flex  align-items-center" style={{ height: '100vh', marginTop: '20px' }}>
          <Card style={{ width: '90%' }}>
            <Card.Body>
              <Card.Title><h1>{clan.clanName}</h1></Card.Title>
              <Avatar src={clan.clanLogo} sx={{ width: 150, height: 150 }} className='mx-auto mb-2'></Avatar>
              <Card.Text>Tag: {clan.clanTag}</Card.Text>
              <Card.Text>Description: {clan.clanDescription}</Card.Text>
              <Card.Text>Members: {clan.numberMembers}/{clan.maxMembers}</Card.Text>
              <Card.Text>Created: {clan.creationDate}</Card.Text>
              <Card.Text>Type: {clan.type}</Card.Text>
              <div>
                <div className='row'>
                  <div className='col-12 col-sm-6'>
                    <Button variant="warning" className="mx-sm-auto my-2" onClick={showMembers}>Show Members</Button>
                  </div>
                  <div className='col-12 col-sm-6'>
                    <Button variant="primary" className="mx-sm-auto my-2" onClick={showSettings}>Change Settings</Button>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-12 col-sm-6'>
                    <Button variant="secondary" className="mx-sm-auto my-2" onClick={showInvites}>Invite</Button>
                  </div>
                  <div className='col-12 col-sm-6'>
                    <Button variant="danger" className="mx-sm-auto my-2" onClick={handleLeave}>Leave</Button>
                  </div>
                </div>
              </div>

            </Card.Body>
          </Card>
        </Container >
      }
      {showClanMembers && <Container className="d-flex  align-items-center" style={{ height: '100vh', marginTop: '20px' }}>
        <Card style={{ width: '90%' }}>
          <Card.Body>
            <Card.Title><h1>Members</h1></Card.Title>
            <div style={{ maxHeight: "500px", overflow: "auto" }}>
              <Table striped bordered hover >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clanMembers.map((member, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{member.username}</td>
                        <td>{member.id === clan.idBoss ? 'Boss' : 'Member'}</td>
                        <td>
                          <Button variant="primary" style={{ margin: "10px" }} onClick={() => handlePromoteToBoss(member.id)}>Promote</Button>
                          <Button variant="danger" style={{ margin: "10px" }} onClick={() => handleKickPlayer(member.id)}>Kick</Button>
                        </td>
                      </tr>
                    )
                  })
                  }
                </tbody>
              </Table>
            </div>
            <Button variant="danger" onClick={showInfoClan}>Close</Button>
          </Card.Body>
        </Card>
      </Container>}
      {(showClanSettings && !uploadPhoto) && <Container className="d-flex  align-items-center " style={{ height: '100vh', marginTop: '20px' }}>
        <Card style={{ width: '90%' }}>
          <Card.Body >
            <Card.Title ><h1>Settings</h1> </Card.Title>
            <Form.Group className='d-flex align-items-center justify-content-between' style={{ marginBottom: "10px" }}>
              {changeClanName ? <Form.Control
                type='text'
                placeholder='Enter clan name'
                value={newClanName}
                onChange={(event) => setNewClanName(event.target.value)}
                className='mx-auto'
                style={{ maxWidth: '160px' }}
              /> : <p>Name:{clan.clanName}</p>} {changeClanName ? <div><Button variant='success' onClick={handleNameChange}>Confirm</Button><Button variant='danger' style={{ marginLeft: "5px" }} onClick={handleCloseChangeClanName}>Cancel</Button></div> : <Button variant="primary" onClick={handleChangeClanName}>Change</Button>}
            </Form.Group>
            <Form.Group className='d-flex align-items-center justify-content-between' style={{ marginBottom: "10px" }}>
              {changeClanLogo ? <Form.Control type='file' placeholder='Enter clan logo' onChange={(e) => {
                const file = e.target.files[0];
                if (file && file.size > 2 * 1024 * 1024) {
                  setErrorMessage("The file size exceeds the limit of 2 MB.");
                } else {
                  setNewClanLogo(file);
                }
              }} className='mx-auto' style={{ maxWidth: '180px' }} custom
                accept="image/*" /> : <p>Logo</p>} {changeClanLogo ? <div><Button variant='success' onClick={handleLogoChange}>Confirm</Button><Button variant='danger' style={{ marginLeft: "5px" }} onClick={handleCloseChangeClanLogo}>Cancel</Button></div> : <Button variant="primary" onClick={handleChangeClanLogo}>Change</Button>}
            </Form.Group>
            <Form.Group className='d-flex align-items-center justify-content-between' style={{ marginBottom: "10px" }}>
              {changeClanTag ? <Form.Control type='text' placeholder='Enter clan tag' value={newClanTag} onChange={(event) => setNewClanTag(event.target.value)} className='mx-auto' style={{ maxWidth: '160px' }} /> : <p>Tag:{clan.clanTag}</p>} {changeClanTag ? <div><Button variant='success' onClick={handleTagChange}>Confirm</Button><Button variant='danger' style={{ marginLeft: "5px" }} onClick={handleCloseChangeClanTag}>Cancel</Button></div> : <Button variant="primary" onClick={handleChangeClanTag}>Change</Button>}
            </Form.Group>
            <Form.Group className='d-flex align-items-center justify-content-between' style={{ marginBottom: "10px" }}>
              {changeClanDescription ? <Form.Control as='textarea' placeholder='Enter clan description' value={newClanDescription} onChange={(event) => setNewClanDescription(event.target.value)} className='mx-auto' style={{ maxWidth: '200px' }} /> : <p>Description:{clan.clanDescription}</p>} {changeClanDescription ? <div><Button variant='success' onClick={handleDescriptionChange}>Confirm</Button><Button variant='danger' style={{ marginLeft: "5px" }} onClick={handleCloseChangeClanDescription}>Cancel</Button></div> : <Button variant="primary" onClick={handleChangeClanDescription}>Change</Button>}
            </Form.Group>
            <Form.Group className='d-flex align-items-center justify-content-between' style={{ marginBottom: "10px" }}>
              {changeClanType ? <Form.Control as='select' placeholder='Enter clan type' value={newClanType} onChange={(event) => setNewClanType(event.target.value)} className='mx-auto' style={{ maxWidth: '180px' }}> <option value="Public">Public</option> <option value='Invite Only'>Invite Only</option> <option value='Close'>Close</option> </Form.Control> : <p>Type:{clan.type}</p>} {changeClanType ? <div><Button variant='success' onClick={handleTypeChange}>Confirm</Button><Button variant='danger' style={{ marginLeft: "5px" }} onClick={handleCloseChangeClanType}>Cancel</Button></div> : <Button variant="primary" onClick={handleChangeClanType}>Change</Button>}
            </Form.Group>
            <Form.Group className='d-flex align-items-center justify-content-between' style={{ marginBottom: "10px" }}>
              <p>Invite code: {clan.inviteCode} </p> <Button variant="primary" onClick={handleGenerateInviteCode}>Regenerate</Button>
            </Form.Group>

            <Button variant="danger" onClick={showInfoClanSettings}>Back</Button>
          </Card.Body>

        </Card>
      </Container>}
      {uploadPhoto && 
      <Spinner></Spinner>}

      {showClanInvites && <Container className="d-flex  align-items-center " style={{ height: '100vh', marginTop: '20px' }}>

        <Card style={{ width: '90%' }}>
          <Card.Body >
            <Card.Title ><h1>Invites</h1> </Card.Title>
            <Form.Group>
              <Form.Control type='text' placeholder='Enter the player username' value={usernameInvite} onChange={(event) => setUsernameInvite(event.target.value)} className='mx-auto' style={{ maxWidth: '220px' }} />
              <Button variant="primary" onClick={handleInvite} style={{ marginTop: "10px" }}>Invite</Button>
            </Form.Group>
            <Button variant="danger" onClick={showInfoInvites} style={{ marginTop: "10px" }}>Back</Button>
          </Card.Body>
        </Card>
        <CardGroup className="mt-5">
          {invitesReceived.map((invite, index) => {
            return (
              <Card key={index} style={{ width: '18rem', marginTop: '10px' }}>
                <Card.Body>
                  <Card.Title>New Request</Card.Title>
                  <Card.Text>
                    {invite.username} request to join the clan
                  </Card.Text>
                  <Button variant="primary" onClick={() => handleAcceptInvite(invite)}>Accept</Button>
                  <Button variant="danger" style={{ marginLeft: "5px" }} onClick={() => handleDeclineInvite(invite)}>Decline</Button>
                </Card.Body>
              </Card>
            )
          })}

        </CardGroup>
      </Container>
      }

    </div>

  )
}

export default ClanInfo