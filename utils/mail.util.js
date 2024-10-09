const nodemailer=require('nodemailer');
const generateOTP = require('../functions/generateOTP.fumction');
const BusinessInfo = require('../models/businessInfo.model');

const sendEmail = async (request) => {
    try {
      console.log("request in the MAIL SEND", request);

      //I am using MAILTRAP.IO justfor testing purpose
      const transport = nodemailer.createTransport({
        host: process.env.MAILERHOST,
        port: process.env.MAILERPORT,
        auth: {
          user: process.env.USER, 
          pass: process.env.PASS,
        },
      });
      
      const otp = generateOTP(6);  // Generate a 6-digit OTP
      const expiry = new Date(new Date().getTime() + 10 * 60 * 1000); // 10 minutes expiry
      const expiryFormatted = expiry.toLocaleString(); 

      //updating the OTP and expiryDate 
      const businessInfo = await BusinessInfo.findOneAndUpdate(
        { businessEmail:  request.email },
        {
          $set: {
            emailOTP: otp,
            emailOTPExpiry: expiry,
          },
        },
        { new: true }
      );
  
      const mailOptions = {
        from: "shaikrahul1105@gmail.com", 
        to: request.email, // list of receivers
        subject: "Email Verification", // Subject line
        text: `Your OTP is ${otp}. It will expire at ${expiryFormatted}. Please verify your email address.`, 
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #0056b3;">Email Verification</h2>
            <p>Dear ${request.name || "User"},</p>
            <p>Your OTP is <strong>${otp}</strong> and it will expire on <strong>${expiryFormatted}</strong>.</p>
            <p>If you did not request this, please ignore this email.</p>
            <br>
            <p>Best regards,</p>
            <p>F50 Losers</p>
          </div>
        `,
      };
  
      const mailResponse = await transport.sendMail(mailOptions);
      console.log("Email sent");
      return mailResponse;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  

module.exports=sendEmail