import * as nodemailer from 'nodemailer';
export const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mani.ram@ditstek.com',
    pass: 'qavczplijqdmmluc',
  },
});
