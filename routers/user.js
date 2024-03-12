const express = require('express');
const router = express.Router();
const {createUser, login, forgotPassword, updatePassword, getUser, getAllusers, resetPassword, deleteUser, userUpdate, handleRefreshToken, logOut}= require('../controllers/userController');
const checkToken = require('../middleWare/checkToken');
const upload = require('../middleWare/uploadImage');

router.post('/signUp',upload.single('photo'),createUser);
router.post('/logIn', login);
router.post('/forgot/password', forgotPassword);
router.patch('/update/password/:id', checkToken, updatePassword);
router.get('/getUser/:id', getUser);
router.get('/getAllUsers', getAllusers);
router.patch('/reset-Password/:token', checkToken, resetPassword);
router.delete('/deleteUser', deleteUser);
router.patch('/updateUser/:id', checkToken,upload.single('photo'),userUpdate);
router.get('/refreshToken', handleRefreshToken);
router.get('/logout', logOut);

module.exports= router;