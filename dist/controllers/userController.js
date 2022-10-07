"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const uuid_1 = require("uuid");
const users_1 = require("../models/users");
const utils_1 = require("../utils/utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function createUser(req, res) {
    try {
        const { firstName, lastName, userName, email, phoneNumber, password } = req.body;
        const newId = (0, uuid_1.v4)();
        const validateResult = utils_1.createUserSchema.validate(req.body, utils_1.options);
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
            avatar: 'https://cdn-icons-png.flaticon.com/512/1160/1160040.png?w=740& t=st=1663662557~exp=1663663157~hmac=534541c319dd6da1c7554d1fabb39370d4af64705b9a26bce48c6a08c2555fd8',
            walletBalance: 0.0,
            role: 'user',
            isVerified: false,
        });
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
//# sourceMappingURL=userController.js.map