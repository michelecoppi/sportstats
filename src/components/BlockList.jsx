import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { firestore } from '../firebase'
import { useLocation } from 'react-router-dom'

function BlockList() {
    const { state } = useLocation();
    const email = state && state.email;
    const [blockList, setBlockList] = useState([])

    useEffect(() => {
        const blocklist = onSnapshot(collection(firestore, "blockedUsers"), (snapshot) => {
            const blocklist = snapshot.docs
                .filter(doc => doc.data().blockerEmail === email)
                .map(doc => ({ ...doc.data(), id: doc.id }));
            setBlockList(blocklist);
        });
        return () => {
            blocklist();
        }
    }, [])

    const unblockUser = async (id) => {
        const blocklistRef = doc(firestore, "blockedUsers",id);
        await deleteDoc(blocklistRef);
    }
    const handleBackClick = () => {
        window.history.back();
    }


    return (

        <div >
            {blockList.length === 0 ? (
                <div className='text-center'>
                    <div className='text-center'>
                        <div className="row align-items-start">
                            <div className="col-3">
                                <button onClick={handleBackClick} className="btn btn-danger">Back</button>
                            </div>
                            <div className="col-6">
                                <h1 > Your Block List is empty</h1>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='text-center'>
                    <div className='text-center'>
                        <div className="row align-items-start">
                            <div className="col-3">
                                <button onClick={handleBackClick} className="btn btn-danger">Back</button>
                            </div>
                            <div className="col-6">
                                <h1 > Block List</h1>
                            </div>
                        </div>
                    </div>
                   <center><table className='text-center table table-responsive'>
                        <thead>
                            <tr>
                                <th>Username Blocked</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blockList.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.blockedUsername}</td>
                                    <td>
                                        <button className='btn btn-primary' onClick={() => unblockUser(user.id)}>Unblock</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table></center> 
                </div>
            )}

        </div>

    )
}

export default BlockList