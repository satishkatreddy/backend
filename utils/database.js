const mongoose = require('mongoose');

const database = async(req,res)=>{
  
    try{
       const connection = await mongoose.connect(process.env.MONGO_URL);
       console.log('successfully connected mongoDb')
       return connection;
    }
    catch(error){
        console.error('database connection error:', error.message);
        throw new Error('unabele to connect dataabse...')
    }
}
module.exports = database;