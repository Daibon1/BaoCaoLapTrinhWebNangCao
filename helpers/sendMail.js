// Source - https://stackoverflow.com/q/19877246
// Posted by tonymx227, modified by community. See post 'Timeline' for change history
// Retrieved 2026-05-08, License - CC BY-SA 3.0
// const nodemailer = require('nodemailer');
// module.exports.sendMail = (email, subject, html) => {
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASSWORD
//         }
//     });
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: subject,
//         html: html
//     };
//     transporter.sendMail(mailOptions, function(error, info){
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     })

// }
const nodemailer = require('nodemailer');

module.exports.sendMail = (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.resend.com',
        port: 587,
        secure: false,
        auth: {
            user: 'resend',
            pass: process.env.RESEND_API_KEY
        }
    });

    console.log("[sendMail] Gửi tới:", email);
    console.log("[sendMail] RESEND_API_KEY set:", !!process.env.RESEND_API_KEY);

    const mailOptions = {
        from: 'onboarding@resend.dev',
        to: email,
        subject: subject,
        html: html
    };

    console.log("[sendMail] Bắt đầu gửi...");
    transporter.sendMail(mailOptions, function(error, info) {
        console.log("[sendMail] Callback chạy");
        if (error) {
            console.error("[sendMail] Lỗi:", error.message);
        } else {
            console.log("[sendMail] Thành công:", info.response);
        }
    });
};