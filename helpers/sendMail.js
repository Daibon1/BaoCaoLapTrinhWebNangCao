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
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    console.log("[sendMail] Gửi tới:", email);
    console.log("[sendMail] EMAIL_USER:", process.env.EMAIL_USER);
    console.log("[sendMail] EMAIL_PASSWORD set:", !!process.env.EMAIL_PASSWORD);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.error("[sendMail] Lỗi gửi mail:", error.message);
            console.error("[sendMail] Chi tiết:", error);
        } else {
            console.log("[sendMail] Gửi thành công:", info.response);
        }
    });
};