import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { UserInstance } from '../models/users';
import { changePasswordSchema, createUserSchema, generateToken, loginUserSchema, options, userUpdateSchema } from '../utils/utils';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { emailVerification, forgotPasswordVerification } from '../email/emailVerification';
import { sendVerifyMail } from '../email/sendMail';

const passPhrase = process.env.JWT_SECRET as string;
const mailFrom = process.env.FROM as string;
const mailSubject = process.env.SUBJECT as string;

const avatarUrl = 'https://cdn-icons-png.flaticon.com/512/1160/1160040.png?w=740& t=st=1663662557~exp=1663663157~hmac=534541c319dd6da1c7554d1fabb39370d4af64705b9a26bce48c6a08c2555fd8';

export async function createUser(req:Request, res:Response):Promise<unknown> {
    try {
        const { firstName, lastName, userName, email, phoneNumber, password } = req.body;

        const newId = uuidv4();

        const validateResult = createUserSchema.validate(req.body, options);        

        if(validateResult.error) {
            return res.status(400).json({ error: validateResult.error.details[0].message });
        }

        const duplicateEmail = await UserInstance.findOne({
            where: { email: email }
        });

        if(duplicateEmail) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        const duplicatePhoneNumber = await UserInstance.findOne({
            where: { phoneNumber: phoneNumber }
        });

        if(duplicatePhoneNumber) {
            return res.status(409).json({ error: 'Phone number already exists' });
        }

        const duplicateUserName = await UserInstance.findOne({
            where: { userName: userName }
        });

        if(duplicateUserName) {
            return res.status(409).json({ error: 'Username already taken' });
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
            avatar: avatarUrl,
            walletBalance: 0.0,
            role: 'user',
            isVerified: false,
        });

        const token = generateToken(newId, '30mins');
        const html = emailVerification(token);

        await sendVerifyMail(mailFrom, email, mailSubject, html);

        return res.status(201).json({
            message: 'User successfully created',
            record
        });

    } catch(error) {
        res.status(500).json({ error: error });
        throw new Error(`${error}`);
    }
}

export async function verifyUser(req:Request, res:Response):Promise<unknown> {
    try {
        const { token } = req.params;

        const verified = jwt.verify(token, passPhrase);

        const { id } = verified as { [key: string]: string };

        const record = await UserInstance.findOne({
            where: { id: id }
        });

        await record?.update({ isVerified: true });

        return res.status(302).redirect(`${process.env.FRONTEND_URL}/user/login`);

    } catch(error) {
        res.status(500).json({ error: 'Internal Server Error' });
          throw new Error(`${error}`);        
    }
}

export async function loginUser(req:Request, res:Response):Promise<unknown> {
    try {
        const validate = loginUserSchema.validate(req.body, options);

        if(validate.error) {
            res.status(400).json({ error: validate.error.details[0].message });
        }
        
        const { userInfo, password } = req.body;

        let User = await UserInstance.findOne({
            where: { userName: userInfo }
        }) as unknown as { [key: string]: string };

        if(!User) {
            User = await UserInstance.findOne({
                where: { email: userInfo }
            }) as unknown as { [key: string]: string };
        }

        if (!User) {
            return res.status(403).json({ error: 'User not found' });
        }

        if (!User.isVerified) {
            return res.status(403).json({ error: 'User not verified' });
        }

        const { id } = User;

        const token = generateToken(id, '7d');

        const validatePassword = await bcrypt.compare(password, User.password);

        if(!validatePassword) {
            return res.status(401).json({ error: 'Password do not match' });
        }

        return res.status(200).json({ message: 'Login successful', token, User });

    } catch (error) {
        res.status(500).json({ error: 'failed to login user' });
        throw new Error(`${error}`);
    }
}

export async function forgotPassword(req:Request, res:Response):Promise<unknown> {
    try {
      const { email } = req.body;

      const user = (await UserInstance.findOne({
        where: { email: email }
      })) as unknown as { [key: string]: string };
  
      if (!user) {
        return res.status(404).json({ error: 'email not found' });
      }

      const { id } = user;
      const html = forgotPasswordVerification(id);

      await sendVerifyMail(mailFrom, email, mailSubject, html);
      
      return res.status(200).json({ message: 'Check email for the verification link' });

    } catch (error) {
      res.status(500).json({error});
      throw new Error(`${error}`);
    }
  }

  export async function changePassword(req:Request, res:Response):Promise<unknown> {
    try {
        const validationResult = changePasswordSchema.validate(req.body, options);
        if (validationResult.error) {
            return res.status(400).json({ error: validationResult.error.details[0].message});
        }
        
        const { id } = req.params;
        const user = await UserInstance.findOne({ where: { id: id } });

        if (!user) {
        return res.status(403).json({ error: 'user does not exist' });
        }

        const passwordHash = await bcrypt.hash(req.body.password, 8);
  
        await user?.update({ password: passwordHash });

        return res.status(200).json({ message: 'Password Successfully Changed' });

        } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        throw new Error(`${error}`);
    }
  }

  export async function updateUserRecord(req: Request, res: Response): Promise<unknown> {
    try {
      const { id } = req.params;

      const record = await UserInstance.findOne({ where: { id } });
  
      if (!record) {
        return res.status(400).json({ error: 'Invalid ID, User not found' });
      }

      if (req.body.userName) {
        const check = (await UserInstance.findOne({ where: { 
            userName: req.body.userName 
        } })) as unknown as { [key: string]: string };
  
        if (check && check.id !== id) {
          return res.status(403).json({ error: 'Username already taken' });
        }
      }
  
      const updateRecord = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        avatar: req.body.avatar,
        username: req.body.username,
      };
  
      const validateUpdate = userUpdateSchema.validate(updateRecord, options);
  
      if (validateUpdate.error) {
        return res.status(400).json({ error: validateUpdate.error.details[0].message });
      }
  
      const updateUserRecord = await record?.update(updateRecord);
  
      return res.status(200).json({
        message: 'Update Successful',
        record: updateUserRecord
      });

    } catch (error) {
      return res.status(500).json({ error: 'Failed to update record', route: '/patch/:id' });
    }
  }