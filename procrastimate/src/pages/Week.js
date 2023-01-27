import React from 'react'

import { auth, db, storage } from '../firebase-config'
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, getDocs, collection, addDoc, updateDoc, deleteDoc, documentId } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'
import Paper from '@mui/material/Paper'
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import CircleIcon from '@mui/icons-material/Circle';
import { Checkbox, Typography, Divider, FormControlLabel, Slider, Card } from '@mui/material';
import '../Week.css'

const Week = () => {
  const [user] = useAuthState(auth);
  const [tasks, setTasks] = useState([]);
  const [initted, setInitted] = useState(false);

  const [days, setDays] = useState([]);
  


  if (user != null & !initted) {
    init();
    setInitted(true);
  }
  useEffect(() => {
    console.log(tasks) 
  },[tasks]);
  
  async function init() {
    let chungus = []
    for (let k = 0; k < 7; k++) {

      let today = new Date();
      today.setDate(today.getDate() + k);
      const day= today.getDay() //return 0 to 6
let weekday= ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
console.log(weekday[day])
      chungus.push(weekday[day])
    }
    console.log(chungus)
    setDays(chungus);

    const ref = collection(db, "users", user.uid, "categories"); //reference to all the categories
    const snap = await getDocs(ref); //getting all the categories
    console.log(snap)
    let temp = [];
    snap.forEach((doc) => { //for every category:
      temp.push({name:doc.id, color: doc.get('color')})
      
      
    })
    populateTasks(temp)
    }

  async function populateTasks(cats) {
    let bigTemp = [...tasks];
      for(let i = 0; i < cats.length; i++)  
     { 
      const secondref = collection(db, 'users', user.uid, 'categories', cats[i].name, 'tasks')
      const secondsnap = await getDocs(secondref);
      secondsnap.forEach((doc) => {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //janvier = 0
        let yyyy = today.getFullYear();

        let date = `${yyyy}-${mm}-${dd}`;
        const diffInMs = new Date(doc.get('due')) - new Date(date)
        let diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        if(diffInDays > 7){
          diffInDays = 7;
        }
        if(diffInDays > 0){
        bigTemp.push({ name: doc.get('name'), due: doc.get('due'),color:cats[i].color, width: (13*(diffInDays)-2) + "vw"})
        }
      })}
      console.log(bigTemp)
      
    setTasks([...tasks,...bigTemp]);


  }
 
  return (
    <div>

      <div className='bigContain'>
        {days.map((day) => (
          <div className='contain'>
            
            <Typography variant = 'h4' style = {{textAlign: 'center', fontSize:'2vw', fontWeight: 'bold'}}>{day}</Typography>
            <Divider orientation="vertical" style = {{position: 'absolute'}} />
          </div>
        ))}
         <Divider orientation="vertical" style = {{position: 'absolute', left: '96vw', marginTop: '7vw'}} />
      </div>
      <div class = "taskContainer">
      {tasks.map((task) => (

         
         <div style = {{display: 'flex', width: task.width, backgroundColor: '#2196f3', height: '40px', borderRadius: '2vw',marginBottom:'1vw', padding:'1vw '}}>
          <CircleIcon fontSize = 'large' style={{color:task.color}} />
          <Typography style = {{color: 'white', marginLeft: '1vw'}} variant = 'h6'>{task.name}</Typography>
          </div>
        
       
     ))}
     </div>
    </div >
  )
}

export default Week