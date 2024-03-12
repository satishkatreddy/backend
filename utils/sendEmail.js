// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const sendEmail = async (options) => {
//     const msg = {
//         to: options.email,
//         from: process.env.SENDGRID_MAIL,
//         templateId: options.templateId,
//         dynamic_template_data: options.data,
//     };

//     try {
//         await sgMail.send(msg);
//         console.log('Email Sent');
//     } catch (error) {
//         console.error('SendGrid API Error:', error);
//         if (error.response) {
//             console.error('SendGrid API Response:', error.response.status, error.response.headers, error.response.data);
//         }
//         throw new Error('Failed to send email');
//     }
// };

// module.exports = sendEmail;

const nodemailer = require('nodemailer');
const asyncHandler = require('../utils/asynchHandler');


const sendEmail = asyncHandler(async (data, req, res) => {

  const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.MAIL,
      pass: process.env.PASSWORD,
    },
  });
  // async..await is not allowed in global scope, must use a wrapper
    try {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: `To do app <${process.env.MAIL}>`,
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.htm, // html body
      });
      console.log("Message sent: %s", info.messageId);

    } catch (err) {
      console.log(err)
    }


    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //

})

module.exports = sendEmail;