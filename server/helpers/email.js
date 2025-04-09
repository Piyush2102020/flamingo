const nodemailer = require('nodemailer');
const EventEmitter=require('events');
const eventEmitter=new EventEmitter();

/**
 * Email Notification Module
 * 
 * Uses Nodemailer and EventEmitter to handle password reset email notifications.
 * Emits 'reset' event with user email and reset link to trigger email sending.
 */


const transporter = nodemailer.createTransport({
    service: 'gmail',  
    auth: {
        user: process.env.GOOGLE_MAIL_ACCOUNT,
        pass: process.env.GOOGLE_APP_PASSWORD  
    }
});
const sendEmail = async (to, link) => {
    try {
        const mailOptions = {
            from: process.env.GOOGLE_MAIL_ACCOUNT,
            to: to, 
            subject: "Password Reset Request",
            text: `You requested a password reset. Click the link below to reset your password:\n\n${link}\n\nIf you did not request this, please ignore this email.`,
            html: `
                <p>You requested a password reset.</p>
                <p>Click the link below to reset your password:</p>
                <a href="${link}" style="color:blue; font-weight:bold;">Reset Password</a>
                <p>If you did not request this, please ignore this email.</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};





eventEmitter.on('reset',async (userEmail,link)=>{
    console.log("Sending mail to : ",userEmail);
    sendEmail(userEmail,link);
})



module.exports={eventEmitter};