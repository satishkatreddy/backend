const express = require('express');
const router = express.Router();
const {createToDo, updateTodo, deleteTodo, getAllTodos, getToDo}= require('../controllers/toDoController');

router.post('/create', createToDo);
router.get('/get', getAllTodos);
router.patch('/update/:id', updateTodo);
router.delete('/delete/:id', deleteTodo);
router.get('/getTodo/:id', getToDo);


module.exports = router;