import nodemailer from "nodemailer";
import ejs from "ejs";
import dotenv from "dotenv";
dotenv.config();
const email = process.env.MAIL_FROM_ADDRESS;
const pass = process.env.MAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: email,
    pass: pass,
  },
});
export const sendVerificationEmail = async (useremail, otp) => {
  try {
    
    // const render = await ejs.renderFile(
    //   "./views/mails/verification-email.ejs",
    //   { email: useremail, otp: otp }
    // );
    // if (!render) throw new Error("Something went wrong");
    let mainOptions = {
      from: '"Bibhas Ash" bibhas.ash@graffersid.com',
      to: useremail,
      subject: "Verify Your Email",
      html: `<h2>Hii ${useremail}, <br> Here is One Time Password ${otp} to verify your account </h2>`, 
    };
    
    transporter.sendMail(mainOptions).then(res => console.log("res ",res)).catch(err => console.log(err))
    
  } catch (error) {
    console.log(error)
    return error;
  }
};

export const sendForgotPasswordEmail = async (useremail, otp) => {
    try {
        // const render = await ejs.renderFile(
        //   "./views/mails/password-reset-email.ejs",
        //   { email: useremail, otp: otp }
        // );
        // if (!render) throw new Error("Something went wrong");
        let mainOptions = {
          from: '"Bibhas" bibhas.ash@graffersid.com',
          to: useremail,
          subject: "Forgot Password Email",
          html:`<h2>Hii ${useremail}, <br> Here is One Time Password ${otp} to verify your account </h2>`,
        };
    
        let response = await transporter.sendMail(mainOptions)
        return response

      } catch (error) {
        console.log("ff"+error)
        return error;
      } 
};

export const sendOrderRecieptEmail = async () => {};
