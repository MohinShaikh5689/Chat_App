import express from 'express';
import { SignUp, LogIn, getProfile, updateProfile,getUsers,getUserByName } from '../controllers/authController.js';
import { protect } from '../middleware/AuthMiddleware.js';

const router = express.Router()

router.post('/signup', SignUp);
router.post('/login', LogIn);
router.patch('/profile', protect, updateProfile);
router.get('/profile', protect, getProfile);
router.get('/', protect, getUsers);
router.get('/:name', protect, getUserByName);



export default router;