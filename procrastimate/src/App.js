import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Day from './pages/Day';
import Week from './pages/Week';
import Tasks from './pages/Tasks';
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from './firebase-config'
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, getDocs, collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'
import AppBar from '@mui/material/AppBar';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import PlaylistAddCheckRoundedIcon from '@mui/icons-material/PlaylistAddCheckRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import Button from '@mui/material/Button'
import { Toolbar } from '@mui/material';
function App() {

  const [user] = useAuthState(auth);
  const [initted, setInitted] = useState(false);

  const [cats, setCats] = useState([])

  let navigate = useNavigate();


  console.log(cats)
  //put default in user gen
  //start on day

  const signOutStuff = () => {
    navigate('/');
    signOut(auth);
    console.log("test")
  }
  if (user != null & !initted) {
    init();
    setInitted(true);
  }
  async function init() {
    console.log('init');
    const ref = collection(db, "users", user.uid, "categories");
    const snap = await getDocs(ref);
    let temp = [];
    snap.forEach((doc) => {
      temp.push({ name: doc.get('name'), color: doc.get('color') })
    })
    setCats(temp);
  }


  return (
    <div>
      {user != null &&
        <div>
          
          <div>
            
            <Link to='/day'  style = {{textDecoration: 'none'}}><Button variant = 'contained' style = {{margin:'1vw'}}>Day</Button></Link>
            <Link to='/week'  style = {{textDecoration: 'none'}}><Button variant = 'contained' style = {{margin:'1vw'}}>Week</Button></Link>
            <Link to='/tasks'  style = {{textDecoration: 'none'}}><Button variant = 'contained' style = {{margin:'1vw'}}>Tasks</Button></Link>
            <Button onClick={signOutStuff} variant = 'outlined' style = {{margin:'1vw', float:'right'}}>Log Out</Button>

           </div>

        </div>}
    </div>
  );
}

export default App;
