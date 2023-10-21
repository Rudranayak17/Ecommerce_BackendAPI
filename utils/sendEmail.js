import nodemailer from "nodemailer";


const sendEmail=async(options)=>{

const transporter=nodemailer.createTransport({
    host:process.env.SMPT_MAIL_HOST,
    port:process.env.SMPT_MAIL_PORT,
    service:process.env.SERVICE,
    auth:{
        user:process.env.SMPT_MAIL,//user
        pass:process.env.SMPT_PASSWORD
    }
})
const mailOptions={
    from:process.env.SMPT_MAIL,
    to:options.email,
    subject:options.subject,
    text:options.message,
};
await transporter.sendMail(mailOptions)

}



export default sendEmail