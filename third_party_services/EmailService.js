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
    // const render = await ejs.renderFile(
    //   "https://drive.google.com/file/d/1L9IrWPRcsZ2iTpn0LWteSQ3fyypLeRHW/view?usp=sharing",
    //   { email: useremail, otp: otp }
    // );
    // if (!render) throw new Error("Something went wrong");
    let mainOptions = {
      from: '"Bibhas" bibhas.ash@graffersid.com',
      to: useremail,
      subject: "Verify Your Email",
      html: `<h5>${useremail} Here's your One Time Password to verify your account.<h5>
      <p>${otp}</p>`,
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
        //   "https://drive.google.com/file/d/1iXdVrfJFQZnRhrK3xjypp2VJ0-PlgMu9/view?usp=sharing",
        //   { email: useremail, otp: otp }
        // );
        // if (!render) throw new Error("Something went wrong");
        let mainOptions = {
          from: '"Bibhas" bibhas.ash@graffersid.com',
          to: useremail,
          subject: "Forgot Password Email",
          html: `<h5>${useremail} Here's your One Time Password to verify your account.<h5>
                 <p>${otp}</p>`,
        };
    
        transporter.sendMail(mainOptions).then(res => console.log("res ",res)).catch(err => console.log(err))
        
      } catch (error) {
        console.log(error)
        return error;
      } 
};

export const sendOrderRecieptEmail = async () => {};
