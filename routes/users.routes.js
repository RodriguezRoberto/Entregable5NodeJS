const express = require( 'express' );
const { body } = require('express-validator');

const { 
    userExists,
    protectToken,
    protectAdmin,
    protectAccountOwner
} = require('../middlewares/users.middlewares');

const { 
    createUserValidations, 
    checkValidations 
} = require('../middlewares/validations.middlewares');

const {
    getAllUsers,
    createUser,
    getUserById,
    updateUserbyId,
    deleteUserById,
    login,
    checkToken
} = require( '../controllers/users.controller' );

const router = express.Router();

router.post( '/', createUserValidations, checkValidations, createUser );

router.post( '/login', login )

router.use(protectToken);

router.get( '/', protectAdmin, getAllUsers );

router.get( '/check-token', checkToken );

router.get( '/:id', protectAdmin, userExists, getUserById );

router.patch( '/:id', userExists, protectAccountOwner, updateUserbyId );

router.delete( '/:id', userExists, protectAccountOwner, deleteUserById );

module.exports = { usersRouter: router };