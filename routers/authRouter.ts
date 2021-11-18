import express from 'express';
import {
  login,
  register,
  logout,
  getUser,
} from '../controllers/authController';
import verifyToken from '../config/verifyToken';

const router = express.Router();

router.post('/login', login);
router.get('/user', verifyToken, getUser);
router.post('/register', register);
router.post('/logout', logout);

export default router;
