import { createContext, useContext,  useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, } from "firebase/auth";
import {auth } from '../firebase'

const UserContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState({})

    const createUser =(email, password) =>{
        return createUserWithEmailAndPassword(auth, email, password)
    }

  
const signIn =(email, password) =>{
    return signInWithEmailAndPassword(auth,email,password);
}

const logout = () =>{
    return signOut(auth);
}

const resetPassword = (email) =>{
    return sendPasswordResetEmail(auth, email, {url: 'https://sportstats-42976.firebaseapp.com/signin'});
}

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {    
         setUser(currentUser);
        })
        return () =>{
            unsubscribe();
        }
    }, [])

    return (
     <UserContext.Provider value={{ createUser, user, logout, signIn, resetPassword, }}>
     {children}
     </UserContext.Provider>
    )

}
export const UserAuth = () => {
    return useContext(UserContext)
}