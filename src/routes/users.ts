import { Router } from 'express';
import { changePassword, createUser, forgotPassword, getAllUser, getSingleUser, loginUser, verifyUser } from '../controllers/userController';

const router = Router();

router.post('/register', createUser);
router.get('/verify/:token', verifyUser);
router.post('/login', loginUser);
router.get('/single-user/:id', getSingleUser);
router.get('/getAllUsers', getAllUser);
// router.patch('/update/:id', auth, updateUserRecord);
router.post('/forgotpassword', forgotPassword);
router.patch('/change-password/:id', changePassword);
// router.patch('/creditWallet', auth, creditUserWallet);

export default router;
