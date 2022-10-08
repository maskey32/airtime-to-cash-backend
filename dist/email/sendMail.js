"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerifyMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailUser = process.env.GMAIL_USER;
const mailPass = process.env.GMAIL_PASS;
const fromUser = process.env.FROM;
const userSubject = process.env.SUBJECT;
const transport = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: mailUser,
        pass: mailPass
    },
    tls: {
        rejectUnauthorized: false
    },
});
const sendVerifyMail = (from, to, subject, html) => {
    return new Promise((resolve, reject) => {
        transport.sendMail({ from: fromUser, subject: userSubject, to, html }, (err, info) => {
            if (err)
                reject(err);
            resolve(info);
        });
    });
};
exports.sendVerifyMail = sendVerifyMail;
//# sourceMappingURL=sendMail.js.map