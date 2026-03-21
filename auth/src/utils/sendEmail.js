import createTransport from "../config/mailtrap.js";

const sendEmail = async ({to, subject, html}) => {
  try {
    //const info = await createTransport().sendMail({...}) // BOTH ARE CORRECT
    const transporter = createTransport()
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: to,
      subject: subject,
      html: html,
    });
    console.log("Email sent:", info.messageId);
  } catch (error) {
     console.log("Email error: ", error);
  }
};

export default sendEmail;
