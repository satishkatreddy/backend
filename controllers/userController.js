const userModel = require('../models/userModel');
const mongoose = require('mongoose');
const appError = require('../utils/appError');
const asynchHandler = require('../utils/asynchHandler');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const createUser = asynchHandler(async (req, res) => {

    const user = {
        firstName,
        lastName,
        email,
        password
    } = req.body;

    if (!user || !user.length === 0) {
        throw new appError('provide valid input', 400)
    }
    const checkEmail = await userModel.findOne({ email: email });
    if (checkEmail) {
        throw new appError('user already exists', 400);
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    const photo = req.file ? req.file.filename : 'default.jpg';
    const users = await userModel.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashPassword,
        photo: photo
    })
    return res.status(200).json({ message: "user is created", data: users });

})


const login = asynchHandler(async (req, res) => {
    const users = {
        email,
        password
    } = req.body;

    if (!users || !users.length === 0) {
        throw new appError('provide valid Input', 400);
    }
    const usersCheck = await userModel.findOne({ email: email, active: true });
    if (!usersCheck) {
        throw new appError('user not found', 400)
    }
    const checkPassword = await usersCheck.isPasswordMatched(password);
    if (!checkPassword) {
        throw new appError('password is incorrect', 400)
    }
    const token = await generateToken(usersCheck._id);
    return res.status(200).json({
        message: 'login successfully', data: {
            _id: usersCheck._id,
            firstName: usersCheck.firstName,
            lastName: usersCheck.lastName,
            email: usersCheck.email,
            password: usersCheck.password,
            token: token
        }
    })

})

const getAllusers = asynchHandler(async (req, res) => {

    const users = await userModel.find();
    if (!users || !users.length === 0) {
        throw new appError('users not found', 400)
    }
    return res.status(200).json({ message: " fetched details successfuly", data: users })

})





const forgotPassword = asynchHandler(async (req, res) => {

    const { email } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
        throw new AppError('user is not found', 404);
    }
    const token = await user.passwordResetToken();
    await user.save();
    const resetUrl = `Hii, please follow this link to reset-your-password, and valid up to 10 minutes in this link <a href=http://locaolhost:5500/api/user/reset-password/${token}>click</a>`;
    const data = {
        to: email,
        text: 'Hey User!!',
        subject: "forgot-password-link",
        htm: resetUrl
    }
    await sendEmail(data);
    return res.status(200).json({ message: "Successfully token is sent to mail", data: token });
})

const getUser = asynchHandler(async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new appError('provide valid Id', 400)
    }
    const user = await userModel.findById({ _id: id, active: true })
    if (!user || !user.length === 0) {
        throw new appError('user not found', 404)
    }
    return res.status(200).json({ message: "fetched  user details", data: user });
})

const updatePassword = asynchHandler(async (req, res) => {

    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new appError('provide valid Id', 400)
    }
    const { password } = req.body;

    const passwordUpdate = await userModel.findById({ _id: id, active: true });

    if (password) {
        passwordUpdate.password = password;
        const updateUser = await passwordUpdate.save();
        return res.status(200).json({ message: "password updated successfully", data: updateUser });
    }
})




const resetPassword = asynchHandler(async (req, res) => {
    const password = req.body.password;
    const token = req.params.token;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await userModel.findOne({
        passwordRefreshToken: hashedToken,
        expireToken: { $gt: Date.now() }
    });

    if (!user) {
        // Provide more information about the error
        throw new appError('Invalid or expired token. Please request a new password reset link.');
    }

    // Reset the password and remove token-related fields
    user.password = password;
    user.passwordRefreshToken = undefined;
    user.expireToken = undefined;
    await user.save();
    res.status(200).json({ message: 'Password reset successful.' });
});

const deleteUser = asynchHandler(async (req, res) => {

    const id = req.params.id
    if (!mongoose.ObjectId.isValid(id)) {
        throw new appError('provide valid Id', 400);
    }
    const userDelete = await userModel.findById({ _id: id })
    if (!userDelete || !userDelete.length === 0) {
        throw new appError('user is not Deleted', 400)
    }
    return res.status(200).json({ message: "user is successfully deleted", data: userDelete })
})


const logOut = asynchHandler(async (req, res) => {

    const cookie = req.cookie;
    if (!cookie.refreshToken) {
        throw new appError('No refreshToken token in cookie', 400)
    }
    const refreshToken = cookie.refreshToken;
    const user = await userModel.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204);
    }
    await userModel.findByIdAndUpdate(refreshToken, {
        refreshToken: ""
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    });
    return res.sendStatus(204);
})


const userUpdate = asynchHandler(async (req, res) => {

    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new appError('provide valid Id', 400)
    }
    const users = await userModel.findById({ _id: id, active: true });
    if (!users || users.length === 0) {
        throw new appError('user not found', 404)
    }
    const userUpdate = await userModel.findByIdAndUpdate(id, {
        $set: {
            firstName: req.body.firstName ?? users.firstName,
            lastName: req.body.lastName ?? users.lastName,
            email: req.body.email ?? users.email,
            photo: req.file ? req.file.filename : users.photo
        }
    }, { new: true })
    return res.status(200).json({ message: "users updated successfully", data: userUpdate })
})


const handleRefreshToken = asynchHandler(async (req, res) => {

    const cookie = req.cookies;
    if (!cookie || cookie.refreshToken.length === 0) {
        throw new appError("No refreshToken in this cookie")
    }
    const refreshToken = cookie.refreshToken;
    const user = await userModel.findOne({ refreshToken });
    if (!user) {
        throw new appError("user is not found in the refreshToken in the db", 400)
    }
    jwt.verify(refreshToken, process.env.SECRET_KEY, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new appError('There is something went wrong')
        }
        const accessToken = generateToken(user?._id)
        return res.status(200).json({ message: accessToken })
    })
})



module.exports = {
    createUser,
    login,
    getAllusers,
    forgotPassword,
    getUser,
    updatePassword,
    resetPassword,
    deleteUser,
    userUpdate,
    logOut,
    handleRefreshToken
}