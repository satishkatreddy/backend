const todoModel = require('../models/toDoModel');
const asyncHandler = require('../utils/asynchHandler');
const appError = require('../utils/appError');
const mongoose =require('mongoose');
const  createToDo = asyncHandler(async(req,res)=>{

    const  todo= {
        workName, workType, duration, userId
    } = req.body;

    if(!todo || !todo.length === 0){
         throw new appError('provide valid input', 400);
    }

    const ToDo = await todoModel.create({
        workName:workName,
        workType:workType,
        duration:duration,
        userId: userId
    })
    return res.status(201).json({message:'TODOLIST is successfully created', data: ToDo})  
})


const getAllTodos = asyncHandler(async(req,res)=>{

     const allTodos = await todoModel.find();
     if(!allTodos || !allTodos.length < 0){
        throw new appError('failed to fetched details', 400)
     }
     return res.status(200).json({message:"fetched succesffuly Todo", data: allTodos})
})

const updateTodo = asyncHandler(async(req,res)=>{
   const updateId = req.params.id;
   if (!mongoose.Types.ObjectId.isValid(updateId)) {
    throw new appError( "Please enter the valid brand Id", 400)
}
const exisistingUpdateTodo = await todoModel.findById({_id: updateId, active: true})

if(!exisistingUpdateTodo || !exisistingUpdateTodo.length === 0){
    throw new appError('provide valid Details', 400)
}
   const  todo= {
    workName, workType, duration, userId
} = req.body;

if(!todo || !todo.length ===0){
     throw new appError('provide valid input', 400);
}
   const updateTodos = await todoModel.findByIdAndUpdate(updateId, {

      $set:{
         workName: req.body.workName ?? workName,
         workType: req.body.workType  ?? workType,
         duration: req.body.duration ?? duration
      }
   },{ new: true})
   return res.status(200).json({message:'successfully updated TodoList', data: updateTodos});      
})

const getToDo = asyncHandler(async(req,res)=>{
   const toDoId = req.params.id;
   if(!mongoose.Types.ObjectId.isValid(toDoId)){
       throw new appError('provide valid Id', 400)
   }
   const toDo = await todoModel.findById({_id: toDoId, active: true}).select('workName workType duration')
   .populate('userId', 'firstName lastName photo').lean();
   if(!toDo || !toDo.length === 0){
      throw new appError('provide valid Details', 400)
   }
   return res.status(200).json({message:"toDo id successfully fetched", data: toDo})
})

const deleteTodo = asyncHandler(async(req,res)=>{
   
     const deleteId = req.params.id;
     if(!mongoose.Types.ObjectId.isValid(deleteId)){
        throw new appError('provide valid Id', 400)
     }
     const ToDo = await todoModel.findByIdAndDelete({_id:deleteId, active: true});
     return res.status(200).json({message: "successfully deleted ",data: ToDo})
})

module.exports= {
    createToDo,
    getAllTodos,
    updateTodo,
    deleteTodo,
    getToDo
}