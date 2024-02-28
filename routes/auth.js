import express from 'express'

const router = express.Router();

//controllers
import {register, login, getAllUsers, updateUser, deleteUser} from '../controllers/auth';

router.post('/register', register);
router.post('/login', login);
router.get('/getAllUsers', getAllUsers);
router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id',deleteUser);

module.exports = router;