import dotenv from "dotenv";
dotenv.config();

import { transporter } from "./mailer.js";
import { otpTemplate, forgotPasswordTemplate } from "./emailTemplates.js";


// 📩 Send OTP Mail
export const sendOtpMail = async ({ email, name, otp }) => {
  try {
    console.log("📨 Sending OTP mail to:", email);

    const info = await transporter.sendMail({
      from: `"E-Learning Platform" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "OTP Verification",
      html: otpTemplate({ name, otp }),
    });

    console.log("OTP mail sent:", info.messageId);
    return info;
  } catch (error) {
    console.error(" OTP MAIL ERROR:", error);
    
  }
};

// 📩 Send Forgot Password Mail
export const sendForgotMail = async ({ email, token }) => {
  try {
    console.log("📨 Sending forgot-password mail to:", email);

    const info = await transporter.sendMail({
      from: `"E-Learning Platform" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Reset Password",
      html: forgotPasswordTemplate({ token }),
    });

    console.log("✅ Forgot-password mail sent:", info.messageId);
    return info;
  } catch (error) {
    console.error(" FORGOT MAIL ERROR:", error);
    
  }
};
