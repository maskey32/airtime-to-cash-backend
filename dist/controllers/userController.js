"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.verifyUser = exports.createUser = void 0;
const uuid_1 = require("uuid");
const users_1 = require("../models/users");
const utils_1 = require("../utils/utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailVerification_1 = require("../email/emailVerification");
const sendMail_1 = require("../email/sendMail");
const passPhrase = process.env.JWT_SECRET;
const mailFrom = process.env.FROM;
const mailSubject = process.env.SUBJECT;
const avatarUrl = 'https://cdn-icons-png.flaticon.com/512/1160/1160040.png?w=740& t=st=1663662557~exp=1663663157~hmac=534541c319dd6da1c7554d1fabb39370d4af64705b9a26bce48c6a08c2555fd8';
async function createUser(req, res) {
    try {
        const { firstName, lastName, userName, email, phoneNumber, password } = req.body;
        const newId = (0, uuid_1.v4)();
        const validateResult = utils_1.createUserSchema.validate(req.body, utils_1.options);
        console.log(validateResult.error?.details);
        if (validateResult.error) {
            return res.status(400).json({
                error: validateResult.error.details[0].message
            });
        }
        const duplicateEmail = await users_1.UserInstance.findOne({
            where: { email: email }
        });
        if (duplicateEmail) {
            return res.status(409).json({
                error: 'Email already exists'
            });
        }
        const duplicatePhoneNumber = await users_1.UserInstance.findOne({
            where: { phoneNumber: phoneNumber }
        });
        if (duplicatePhoneNumber) {
            return res.status(409).json({
                error: 'Phone number already exists'
            });
        }
        const duplicateUserName = await users_1.UserInstance.findOne({
            where: { userName: userName }
        });
        if (duplicateUserName) {
            return res.status(409).json({
                error: 'Username already taken'
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 8);
        const record = await users_1.UserInstance.create({
            id: newId,
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            email: email,
            password: passwordHash,
            phoneNumber: phoneNumber,
            avatar: avatarUrl,
            walletBalance: 0.0,
            role: 'user',
            isVerified: false,
        });
        const token = (0, utils_1.generateToken)(newId, '30mins');
        const html = (0, emailVerification_1.emailVerification)(token);
        await (0, sendMail_1.sendVerifyMail)(mailFrom, email, mailSubject, html);
        return res.status(201).json({
            message: 'User successfully created',
            record
        });
    }
    catch (error) {
        res.status(500).json({
            error: error
        });
        throw new Error(`${error}`);
    }
}
exports.createUser = createUser;
async function verifyUser(req, res) {
    try {
        const { token } = req.params;
        const verified = jsonwebtoken_1.default.verify(token, passPhrase);
        const { id } = verified;
        const record = await users_1.UserInstance.findOne({
            where: { id: id }
        });
        await record?.update({
            isVerified: true
        });
        return res.status(302).redirect(`${process.env.FRONTEND_URL}/user/login`);
    }
    catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
        });
        throw new Error(`${error}`);
    }
}
exports.verifyUser = verifyUser;
async function loginUser(req, res) {
    try {
        const validate = utils_1.loginUserSchema.validate(req.body, utils_1.options);
        if (validate.error) {
            res.status(400).json({ error: validate.error.details[0].message });
        }
        const { userInfo, password } = req.body;
        let User = await users_1.UserInstance.findOne({
            where: { userName: userInfo }
        });
        if (!User) {
            User = await users_1.UserInstance.findOne({
                where: { email: userInfo }
            });
        }
        if (!User) {
            return res.status(403).json({ error: 'User not found' });
        }
        if (!User.isVerified) {
            return res.status(403).json({ error: 'User not verified' });
        }
        const { id } = User;
        const token = (0, utils_1.generateToken)(id, '7d');
        const validatePassword = await bcryptjs_1.default.compare(password, User.password);
        if (!validatePassword) {
            return res.status(401).json({ error: 'Password do not match' });
        }
        return res.status(200).json({ message: 'Login successful', token, User });
    }
    catch (error) {
    }
}
exports.loginUser = loginUser;
//# sourceMappingURL=userController.js.map