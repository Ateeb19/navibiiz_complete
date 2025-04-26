const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.ionos.de",
    port: 587, 
    secure: false, 
    auth: {
        user: "info@novibiz.com",
        pass: "Novibiz*2025",
    },
    tls: {
        rejectUnauthorized: false, 
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.log('SMTP Connection Error:', error);
    } else {
        console.log('SMTP Server is ready to send emails.');
    }
});

const sendMail = async (to, subject, htmlContent) => {
    try {
        const info = await transporter.sendMail({
            from: '"Novibiz" <info@novibiz.com>',
            to: to,
            subject: subject,
            html: htmlContent,
        });

        console.log("Email sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = sendMail;
