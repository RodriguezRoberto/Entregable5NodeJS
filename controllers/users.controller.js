const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); 

// Models
const { User } = require( '../models/user.model' );
const { Repair } = require('../models/repair.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

dotenv.config({ path: './config.env' });

const getAllUsers = catchAsync(async ( req, res ) => {
    const users = await User.findAll({
        where: { status: "active" },
        attributes: { exclude: ['password'] },
        include: [{ model: Repair }]
    });
    res.status(200).json({ users });
});

const createUser = catchAsync(async ( req, res ) => {
    const { name, email, password, role } = req.body;

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        name, 
        email, 
        password: hashPassword, 
        role 
    });

    newUser.password = undefined

    res.status(201).json({ status: "success", newUser });
});

const getUserById = catchAsync(async ( req, res ) => {
    const { user } = req;
    res.status(200).json({ user })
});

const updateUserbyId = catchAsync(async ( req, res ) => {
    const { name, email } = req.body;
    const { user } = req;
    await user.update({ name, email })
    res.status(200).json({ staus: "success" })
});

const deleteUserById = catchAsync(async ( req, res ) => {
    const { user } = req;
    await user.update({ status: "unavailable" })
    res.status(200).json({ staus: "success" })
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
  
    // Validate that user exists with given email
    const user = await User.findOne({
      where: { email, status: 'active' },
    });
  
    // Compare password with db
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError('Invalid credentials', 400));
    }
  
    // Generate JWT
    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  
    user.password = undefined;
  
    res.status(200).json({ token, user });
});

const checkToken = catchAsync(async (req, res, next) => {
    res.status(200).json({ user: req.sessionUser });
});

module.exports = { 
    getAllUsers, 
    createUser, 
    getUserById, 
    updateUserbyId, 
    deleteUserById,
    login,
    checkToken
};