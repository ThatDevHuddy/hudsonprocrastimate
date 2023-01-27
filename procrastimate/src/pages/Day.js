import React from 'react'
import { auth, db, storage } from '../firebase-config'
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, getDocs, collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'
import '../Day.css'
import Paper from '@mui/material/Paper'
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Checkbox, Typography, FormControlLabel, Slider,Chip, Accordion, AccordionSummary,AccordionDetails, Card, Divider } from '@mui/material';
const Day = () => {

    const [user] = useAuthState(auth);
    const [tasks, setTasks] = useState([]);
    const [deepWork, setDeepWork] = useState([]);
    const [cats, setCats] = useState([])
    const[dailyMinutes, setDailyMinutes] = useState(90);
    useEffect(() => {
        populateTasks();
    }, [cats]);
    useEffect(() => {
        init();
    },[user])

    async function init() {
        const ref = collection(db, "users", user.uid, "categories"); //reference to all the categories
        const snap = await getDocs(ref); //getting all the categories
        console.log(snap)
        let temp = [];
        snap.forEach((doc) => { //for every category:

            temp.push({ name: doc.get('name'), color: doc.get('color') })
            // for every category push cat name and tasks for that cat to an array
        })
        setCats(temp); //set cats state to that array with cat names and tasks in it
        

        //for each, get all tasks inside that category and append category object with name and array of tasks to array of categories and use .map for all categories and .map for each task in the category.
    }

    async function populateTasks() {
        let bigTemp = [];
        let bigTempRest = [];
        for (let i = 0; i < cats.length; i++) {
            const secondref = collection(db, 'users', user.uid, 'categories', cats[i].name, 'tasks')
            const secondsnap = await getDocs(secondref);
            let temp = [];
            let temprest = [];
            secondsnap.forEach((doc) => {
                if(doc.get('automate')){
                    temp.push({ category: cats[i].name, color:cats[i].color, name: doc.get('name'), due: doc.get('due'), minutes: doc.get('minutes') })
                }
                else{
                    temprest.push({category: cats[i].name, color:cats[i].color, name: doc.get('name') })
                }
            })
            console.log(temp)

            bigTemp = [...bigTemp,...temp];
            bigTempRest = [...bigTempRest,...temprest];
        }
        console.log(bigTemp);
        bigTemp = calculatePriority(bigTemp)
        console.log(bigTempRest)
        setTasks(bigTemp)
        setDeepWork(bigTempRest);
    }
    async function deleteTask(taskName, categoryy) {
        
        console.log('plsdelete')
        const ref = doc(db, 'users', user.uid, "categories", categoryy, 'tasks', taskName)
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
            console.log('idk')
            await deleteDoc(ref).then(
                init()

            )
        }
    
    }
    async function updateMinutes(v,taskName, categoryName,ogMinutes){
        if(v == parseInt(ogMinutes)){
            deleteTask(taskName,categoryName);
        }
        else{
        const ref = doc(db,'users',user.uid,'categories',categoryName,'tasks',taskName)
        await updateDoc(ref,{
            minutes:parseInt(ogMinutes) - v
        }).then(
            init())
        }
    }
    function calculatePriority(data){
        let temp = [...data];
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //janvier = 0
        let yyyy = today.getFullYear();
        let date = `${yyyy}-${mm}-${dd}`;
    
        for(let i = 0; i < data.length; i++){
            data[i].minutes = parseInt(data[i].minutes);
          const diffInMs = new Date(data[i].due) - new Date(date)
          const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
          let priority = 10000 - (15 * diffInDays) + data[i].minutes
          console.log(data[i].name,data[i].minutes,diffInDays);
          temp[i].diffDays = diffInDays;
          if(diffInDays <= 1){
            temp[i].tomm = true;
            priority += 20000;
          }
          else{
            temp[i].tomm = false;
          }
          temp[i].priority = priority;
        }
        
        
        temp.sort((a, b) => (a.priority > b.priority) ? -1 : 1)
        console.log(temp);
        let count = 0;
        for(let j = 0; j < temp.length; j++){
            temp[j].minutes = parseInt(temp[j].minutes)
          if(temp[j].tomm){
            temp[j].day = true;
            count += temp[j].minutes;
          }
          else{
            console.log(count)
            if(count < dailyMinutes){
                
              temp[j].day = true;
              count += temp[j].minutes;
              console.log(count)
              if(count > dailyMinutes){
                temp[j].minutesToDo = temp[j].minutes - (count-dailyMinutes);
              }
            }
            else{
            temp[j].day = false;
            }
        }
          
        }
       console.log(temp)
        return temp;
      }
 
    return (
        <div>
            
            
                <Paper className="group" elevation={4}>
                    <Typography style={{ padding: '2%', fontWeight: 'bold', fontSize: '35' }} variant='h4'>Today:</Typography>
                    <Divider/>
                    <div style={{display:'flex', flexDirection:'column', paddingLeft: '2%', paddingTop: '1%'}}>
                        {tasks && tasks.map((task) => (

                            task.day && <>
                            <div style = {{display: 'flex', alignItems:'center'}} onClick={()=>deleteTask(task.name,task.category)}>
                           <CheckCircleOutlineIcon className = 'checkbox' fontSize = 'large' style={{color:task.color, paddingLeft: '2%'}}/>
                            {task.tomm && <Typography className = "label" style={{ padding: '2%', fontSize: '4vw',color: 'red' }} variant='h5'>{task.name}</Typography>}
                            {!task.tomm && <Typography className = "label" style={{ padding: '2%', fontSize: '4vw' }} variant='h5'>{task.name}</Typography>}
                            
                            
                            
                            {task.minutesToDo != null && <Chip label={'Work for ' + task.minutesToDo + ' mins'} variant="outlined" style = {{marginLeft:'15px',fontSize:'3vw'}}/>}
                            {task.minutesToDo == null && <Chip label={'Work for ' + task.minutes + ' mins'} variant="outlined" style = {{marginLeft:'5px',fontSize:'3vw'}}/>}
                            <Chip label={'Due in ' + task.diffDays + ' days'} variant="outlined" style = {{marginLeft:'10px',fontSize:'3vw'}}/>
                            </div>
                            <Accordion>
                            <AccordionSummary
                           
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            >
                            <ExpandMoreIcon />
                            </AccordionSummary>
                            <AccordionDetails>
                            <Slider defaultValue = {0} onChangeCommitted = {(e,v) => updateMinutes(v,task.name,task.category,task.minutes)} size = "small" className = 'slider' aria-label="Small" valueLabelDisplay='auto' min={0} max = {parseInt(task.minutes)} />
                            </AccordionDetails>
                        </Accordion>
                            
                            </>
                        
                        ))}
                    </div>
                </Paper>
                <Paper className="group" elevation={4}>
                    <Typography style={{ padding: '2%', fontWeight: 'bold', fontSize: '2.5vw' }} variant='h4'>Deep Work:</Typography>
                    <Divider/>
                    <div style={{display:'flex', flexDirection:'column', paddingLeft: '2%', paddingTop: '1%'}}>
                        {deepWork && deepWork.map((task) => (

                            <>
                            <div style = {{display: 'flex', alignItems:'center'}} onClick={()=>deleteTask(task.name,task.category)}>
                           <CheckCircleOutlineIcon className = 'checkbox' fontSize = 'large' style={{color:task.color, paddingLeft: '2%'}}/>
                           <Typography className = "label" style={{ padding: '2%', fontSize: '25px' }} variant='h5'>{task.name}</Typography>
                            </div>
                                    </>
                        
                        ))}
                    </div>
                </Paper>
                
               
            
        </div>
    )
}

export default Day