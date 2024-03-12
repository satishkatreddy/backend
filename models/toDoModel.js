const mongoose = require('mongoose');
 require('../models/userModel');
const  Schema = mongoose.Schema;


const toDoSchema = new Schema({

        workName:{
            type:String,
            required: true,
        },
        workType:{
            type: String,
            required: true,
            enum: ['eating', 'chating', 'calling', 'jumping', 'cooking', 'watching']
        },
        duration:{
            type: Number,
            required: true
        },
        userId:{
            type:Schema.Types.ObjectId,
            ref:'users'
        },
        active: {
            type: Boolean,
            default: true
        } 

}, {timestamps: true})
const todos =  mongoose.model('TodOList', toDoSchema);
module.exports = todos;