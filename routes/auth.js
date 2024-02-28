import express from 'express'

const router = express.Router();

//controllers
import {register, login, getAllUsers} from '../controllers/auth';

router.post('/register', register);
router.post('/login', login);
router.get('/getAllUsers',getAllUsers);

module.exports = router;