import nodemailer from "nodemailer";
import ejs from "ejs";
import dotenv from "dotenv";
dotenv.config();
const email = process.env.MAIL_FROM_ADDRESS;
const pass = process.env.MAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: email,
    pass: pass,
  },
});
export const sendVerificationEmail = async (useremail, otp) => {
  try {
    const render = await ejs.renderFile(
      "mails/verification-email.ejs",
      { email: useremail, otp: otp }
    );
    if (!render) throw new Error("Something went wrong");
    let mainOptions = {
      from: '"Bibhas" bibhas.ash@graffersid.com',
      to: useremail,
      subject: "Verify Your Email",
      html: render,
    };

    transporter.sendMail(mainOptions).then(res => console.log("res ",res)).catch(err => console.log(err))
    
  } catch (error) {
    console.log(error)
    return error;
  }
};

export const sendForgotPasswordEmail = async (useremail, otp) => {
    try {
        const render = await ejs.renderFile(
          "mails/password-reset-email.ejs",
          { email: useremail, otp: otp }
        );
        if (!render) throw new Error("Something went wrong");
        let mainOptions = {
          from: '"Bibhas" bibhas.ash@graffersid.com',
          to: useremail,
          subject: "Forgot Password Email",
          html: render,
        };
    
        transporter.sendMail(mainOptions).then(res => console.log("res ",res)).catch(err => console.log(err))
        
      } catch (error) {
        console.log(error)
        return error;
      } 
};

export const sendOrderRecieptEmail = async () => {};
