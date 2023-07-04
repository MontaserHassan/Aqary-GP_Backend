const nodemailer = require('nodemailer');

const sendEmail = async options => {
    //1) create a transported
    const transporter = nodemailer.createTransport({
        // service: 'Gmail',
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }

        //activate in gmail "less secure app" option
    })

    //2) define the email options
    const mailOptions = {
        from: 'Omar Hesham <mromarhesham1999@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    //3) send the email
    await transporter.sendMail(mailOptions);

}

module.exports = sendEmail;