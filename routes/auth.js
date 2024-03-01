import express from 'express'
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

//controllers
import {register, login, getAllUsers, updateUser, deleteUser} from '../controllers/auth';


router.post('/register', register);
router.post('/login', login);
router.get('/getAllUsers', getAllUsers);
router.put('/updateUser/:id',authenticateToken, updateUser);
router.delete('/deleteUser/:id',authenticateToken,deleteUser);

module.exports = router;