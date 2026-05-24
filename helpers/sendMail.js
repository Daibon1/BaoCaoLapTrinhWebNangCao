// Source - https://stackoverflow.com/q/19877246
// Posted by tonymx227, modified by community. See post 'Timeline' for change history
// Retrieved 2026-05-08, License - CC BY-SA 3.0
const nodemailer = require('nodemailer');
module.exports.sendMail = (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: html
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })

}
// const nodemailer = require('nodemailer');

// module.exports.sendMail = async (email, subject, html) => {
//     console.log("[sendMail] Gửi tới:", email);
//     console.log("[sendMail] RESEND_API_KEY set:", !!process.env.RESEND_API_KEY);

//     try {
//         const response = await fetch('https://api.resend.com/emails', {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 from: 'onboarding@resend.dev',
//                 to: email,
//                 subject: subject,
//                 html: html
//             })
//         });

//         const data = await response.json();
//         if (!response.ok) {
//             console.error("[sendMail] Lỗi:", data);
//         } else {
//             console.log("[sendMail] Thành công:", data.id);
//         }
//     } catch (error) {
//         console.error("[sendMail] Lỗi:", error.message);
//     }
// };
// module.exports.sendMail = async (email, subject, html) => {
//     try {
//         const response = await fetch("https://api.resend.com/emails", {
//             method: "POST",
//             headers: {
//                 Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 from: "Web Tim Viec <onboarding@resend.dev>",
//                 to: email,
//                 subject: subject,
//                 html: html
//             })
//         });

//         const data = await response.json();

//         if (!response.ok) {
//             console.error("[sendMail] Loi Resend:", data);
//             return false;
//         }

//         console.log("[sendMail] Da gui:", data.id);
//         return true;
//     } catch (error) {
//         console.error("[sendMail] Loi:", error.message);
//         return false;
//     }
// };