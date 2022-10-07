import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { UserInstance } from '../models/users';
import { createUserSchema, options } from '../utils/utils';
import bcrypt from 'bcryptjs';

export async function createUser(req:Request, res:Response): Promise<unknown> {
    try {
        const { firstName, lastName, userName, email, phoneNumber, password } = req.body;

        const newId = uuidv4();

        const validateResult = createUserSchema.validate(req.body, options);
        console.log(validateResult.error?.details);
        

        if(validateResult.error) {
            return res.status(400).json({
                error: validateResult.error.details[0].message
            });
        }

        const duplicateEmail = await UserInstance.findOne({
            where: { email: email }
        });

        if(duplicateEmail) {
            return res.status(409).json({
                error: 'Email already exists'
            });
        }

        const duplicatePhoneNumber = await UserInstance.findOne({
            where: { phoneNumber: phoneNumber }
        });

        if(duplicatePhoneNumber) {
            return res.status(409).json({
                error: 'Phone number already exists'
            });
        }

        const duplicateUserName = await UserInstance.findOne({
            where: { userName: userName }
        });

        if(duplicateUserName) {
            return res.status(409).json({
                error: 'Username already taken'
            });
        }

        const passwordHash = await bcrypt.hash(password, 8);

        const record = await UserInstance.create({
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

    } catch(error) {
        res.status(500).json({
            error: error
        });
        throw new Error(`${error}`);
    }
}