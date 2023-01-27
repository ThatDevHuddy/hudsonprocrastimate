import React from 'react'
import { useState, useEffect } from 'react';
import { doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebase-config'
import { useAuthState } from 'react-firebase-hooks/auth'
import '../Tasks.css'
import Paper from '@mui/material/Paper'
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import CircleIcon from '@mui/icons-material/Circle';
import DeleteIcon from '@mui/icons-material/Delete';
import { Checkbox, Typography, FormControlLabel, Slider, Chip, Card,Switch } from '@mui/material';
const Tasks = () => {
    const [user] = useAuthState(auth);
    const [name, setName] = useState('');
    const [color, setColor] = useState('');
    const [populated, setPopulated] = useState([]);
    const [cats, setCats] = useState([])




    const createCategory = async () => {

        const ref = doc(db, 'users', user.uid, 'categories', name)
        const docSnap = await getDoc(ref);
        if (!docSnap.exists()) {
            await setDoc(ref, {
                name: name,
                color: color,
            }).then(init())
            
        }
    }
    useEffect(() => {
        
        populateTasks();
    }, [cats]);
 
useEffect(() => {
   
        init();

    
},[user])
    

    async function createTask(categoryy, date, taskname, minutes,automate) {
        console.log(minutes);
        const ref = doc(db, 'users', user.uid, "categories", categoryy, 'tasks', taskname)
        const docSnap = await getDoc(ref);
        if (!docSnap.exists()) {
            await setDoc(ref, {
                name: taskname,
                due: date,
                minutes: minutes,
                automate:automate
            }).then(
                init()

            )
        }
    }

    async function init() {
        console.log('initted')
        const ref = collection(db, "users", user.uid, "categories"); //reference to all the categories
        const snap = await getDocs(ref); //getting all the categories
        
        let temp = [];
        snap.forEach((doc) => { //for every category:
            temp.push({ name: doc.get('name'), color: doc.get('color') })
            // for every category push cat name and tasks for that cat to an array
        })
        setCats(temp); //set cats state to that array with cat names and tasks in it
     
        //for each, get all tasks inside that category and append category object with name and array of tasks to array of categories and use .map for all categories and .map for each task in the category.
    }

    async function populateTasks() {
        let bigtemp = [...cats]
        for (let i = 0; i < cats.length; i++) {
            const secondref = collection(db, 'users', user.uid, 'categories', cats[i].name, 'tasks')
            const secondsnap = await getDocs(secondref);
            let temp = [];
            secondsnap.forEach((doc) => {

                temp.push({ name: doc.get('name'), due: doc.get('due') })
            })

            bigtemp[i].tasks = temp;
        }
        let anothertemp = [...populated];
        anothertemp = bigtemp;
        setPopulated(anothertemp);

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
    const submit = (e) => {
        e.preventDefault()
        if(e.target.automate.checked){
        if(e.target.name.value == "" || e.target.minutes.value == 0 || e.target.duedate.value == ""){
            alert('write it right bro')
        }
        else{
            createTask(e.target.category.value, e.target.duedate.value, e.target.name.value, e.target.minutes.value,e.target.automate.checked);
            
        }
    }
    else{
        if(e.target.name.value == ""){
            alert('write it right bro')
        }
        else{
            createTask(e.target.category.value, e.target.duedate.value, e.target.name.value, e.target.minutes.value,e.target.automate.checked);
        }
    }
    }

    async function deleteCategory(cat){
        await deleteDoc(doc(db, "users", user.uid,'categories',cat)).then(init());
       
    }

    return (
        <div style={{ marginTop: '2%', marginLeft: '2%' }}>


            <div style={{ position: 'fixed', bottom: '0', display: 'flex', zIndex: '10', padding: '1%', backgroundColor: 'white' }}>
                <TextField type='text' label='Name' value={name} onChange={e => setName(e.target.value)}></TextField>
                <input type='color' value={color} onChange={e => setColor(e.target.value)} style={{ marginLeft: '5px', marginRight: '5px', height: '55px', width: '55px', borderRadius: '2px' }}></input>

                <Fab color='secondary' size='md' type="submit" onClick={createCategory}><AddIcon className='addTaskButton' /></Fab>
            </div>

            {/* 2 .maps, first one shows every category and inside of that there is a .map for every task */}
            <div className='categories'>
                {
                    populated.map((item) => (

                        <Paper className='catContainer' elevation={4}>

                            <Card style={{ display: 'flex', alignItems: 'center',height:'60px' }}>
                                <CircleIcon fontSize='large' style={{ flex:'1',color: item.color, paddingLeft: '2%' }} />
                                <h4 style={{flex:'4',paddingLeft: '3%', fontWeight: 'bold', fontSize: '35px' }} className='catName' variant='h2'>{item.name}</h4>
                                <DeleteIcon fontSize='medium' style={{ flex:'1', position: 'relative', right: '0' }} onClick = {() => deleteCategory(item.name)}/>
                            </Card>
                            {item.tasks != null && <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '5%' }}>
                                {item.tasks.map((item2) => (
                                    <div style = {{display:'flex', alignItems:'center'}}>
                                  <Checkbox onClick={() => deleteTask(item2.name, item.name)}></Checkbox>
                                  <Typography style={{ fontSize: '15px' }} variant='h5'>{item2.name}</Typography>
                                  <Chip label={item2.due} variant="outlined" style = {{marginLeft:'10px'}}/>
                                  </div>
                                ))}
                            </div>}

                            <Card variant="outlined">
                                <form className='newTaskStuff' onSubmit={submit}>
                                    <div className='inputs'>
                                        <TextField label="Task..." style={{ width: '50%' }} name='name' variant="standard" />
                                        <input className='dateinput' name='duedate' type='date' />

                                        <TextField name = "minutes" variant = "outlined" type='number' size="small"/>
                                        <Switch defaultChecked name='automate'/>
                                       
                                        </div>

                                    <Fab size='small' type="submit" color='primary'><AddIcon className='addTaskButton' /></Fab>
                                    <input style={{ display: 'none' }} name='category' value={item.name} onChange = {() => console.log('hi')} />

                                </form>
                            </Card>
                        </Paper>


                    ))
                }
            </div>

        </div >
    )
}

export default Tasks