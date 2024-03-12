const express = require('express');
const mongoose = require('mongoose');
const {config} = require('dotenv');
const connectionDb = require('../backend/utils/database');
const todo = require('../backend/routers/todo');
const users = require('../backend/routers/user');
const app = express();


config({
    path:'./config.env'
})
connectionDb();

//middleWare
app.use(express.json());
app.use('/api/toDo', todo);
app.use('/api/users', users);




const PORT = 5500;
 
app.listen(PORT, (err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log(`server is running on ...${PORT}`)
    }
})

