const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

const sendmail = async(to, subject, html)=>{
    try{
        await transport.sendMail({
            from: `'Kushwaha Kiran Store' <gauravkushwaha903930@gmail.com>`,
            to,
            subject,
            html
        });
    }
    catch(error){
        console.log("Mail Error", error.message);
    }
}


module.exports = sendmail;
