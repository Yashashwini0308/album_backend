const nodemailer = require("nodemailer")
exports.getToken = ()=>{
    return Math.floor(100000 + Math.random() * 900000);
}

exports.sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            port: 587,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text,
        });
        console.log("email sent sucessfully");
        return "email sent sucessfully";
    } catch (error) {
        console.log(error, "email not sent");
        throw new Error("email not sent");
    }
};