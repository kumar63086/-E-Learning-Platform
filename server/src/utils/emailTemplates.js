export const otpTemplate = ({ name, otp }) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            color: red;
        }
        p {
            margin-bottom: 20px;
            color: #666;
        }
        .otp {
            font-size: 36px;
            color: #7b68ee; /* Purple text */
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>OTP Verification</h1>
        <p>Hello ${name} your (One-Time Password) for your account verification is.</p>
        <p class="otp">${otp}</p> 
    </div>
</body>
</html>
`;
export const forgotPasswordTemplate = ({ token }) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f3f3f3;
      padding: 20px;
    }
    .container {
      background: #fff;
      padding: 20px;
      max-width: 600px;
      margin: auto;
      border-radius: 8px;
    }
    .button {
      display: inline-block;
      padding: 14px 22px;
      background: #5a2d82;
      color: white;
      text-decoration: none;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reset Your Password</h1>
    <p>Click the button below to reset your password.</p>
    <a class="button" href="${process.env.FRONTEND_URL}/reset-password/${token}">
      Reset Password
    </a>
    <p>If you didn’t request this, ignore this email.</p>
  </div>
</body>
</html>
`;
