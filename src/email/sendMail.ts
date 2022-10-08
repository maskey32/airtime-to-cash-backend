import nodemailer from 'nodemailer';

const mailUser = process.env.GMAIL_USER as string;
const mailPass = process.env.GMAIL_PASS as string;
const fromUser = process.env.FROM as string;
const userSubject = process.env.SUBJECT as string;

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: mailUser,
      pass: mailPass
    },
    tls: {
      rejectUnauthorized: false
    },
  });

  export const sendVerifyMail = (from:string, to:string, subject:string, html:string):Promise<unknown> => {
    return new Promise((resolve, reject) => {
        transport.sendMail({ from: fromUser, subject: userSubject, to, html }, (err, info) => {
            if(err) reject(err);
            resolve(info);
        });
    });
  }