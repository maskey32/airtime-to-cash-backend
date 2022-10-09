"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.post('/register', userController_1.createUser);
router.get('/verify/:token', userController_1.verifyUser);
router.post('/login', userController_1.loginUser);
router.get('/single-user/:id', userController_1.getSingleUser);
router.get('/getAllUsers', userController_1.getAllUser);
// router.patch('/update/:id', auth, updateUserRecord);
router.post('/forgotpassword', userController_1.forgotPassword);
router.patch('/change-password/:id', userController_1.changePassword);
// router.patch('/creditWallet', auth, creditUserWallet);
exports.default = router;
//# sourceMappingURL=users.js.map