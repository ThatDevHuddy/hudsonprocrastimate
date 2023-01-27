import React from 'react'
import { auth, db, provider } from '../firebase-config'
import { signInWithRedirect, signInWithPopup } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc, collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const SignIn = () => {

  let navigate = useNavigate();

  const [user] = useAuthState(auth);

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      checkExist();
      navigate('/tasks');
      console.log("poo")
    });
  }
  if (user != null) {
    checkExist();
  }

  async function checkExist() {

    const ref = doc(db, 'users', user.uid);
    const docSnap = await getDoc(ref);
    if (!docSnap.exists()) {
      const ref = doc(db, "users", user.uid);
      await setDoc(ref, {
        name: user.displayName,
      });
    }


  }

  return (
    <div>
      <p>Sign In With Google</p>
      <button onClick={signInWithGoogle}>Sign In With Google</button>
    </div>
  )
}

export default SignIn