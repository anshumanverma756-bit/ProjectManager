import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
   new Mailgen({
    theme: "default",
    product : {
      name : "Task Manager",
      link: "https://taskmanagelink.com "
    }
   })
 const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)
 const emailHTML  = mailGenerator.generate(options.mailgenContent)
 
 const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_SMPT_HOST,
  port: process.env.MAILTRAP_SMPT_PORT,
  auth:{
    user: process.env.MAILTRAP_SMTP_USER,
    pass: process.env.MAILTRAP_SMTP_PASS,
  }
})

const mail = {
  from: "mail.taskmanager@example.com",
  to: options.email,
  subject :options.subject,
  text: emailTextual,
  html: emailHTML
}

try{
  await transporter.sendMail(mail)
}catch(error){
  console.error("Email services failed silently make sure that you have provided your mailtrap credential in .env files correctly")
  console.error("Error: ", error);
};

} 



const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our app! We are excited to have you.",
      action: {
        instructions: "To verify your email, please click on the following button.",
        button: {
          color: "#22BC66",
          text: "Verify your email",
          link: verificationUrl,
        },
      },   
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of your account",
      action: {
        instructions: "To reset your password click on the following button or link.",
        button: {
          color: "#22BC66",
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};


export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
};