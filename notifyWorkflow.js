const nodemailer = require('nodemailer');
// //const twilio = require('twilio');

// // MySQL database connection
// // const connection = mysql.createConnection({
// //   host: 'localhost',
// //   user: 'root',
// //   password: 'yourpassword',
// //   database: 'your_database'
// // });

// // Send email function
// let sendEmail = function sendEmail(req,res) {
//   const order = req.body.order_id;
//   let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: '24eg204a18@anurag.edu.in',
//       pass: 'au@123456'
//     }
//   });

//   let mailOptions = {
//     from: '24eg204a18@anurag.edu.in',
//     to: 'vorebe3794@noroasis.com',
//     subject: `Your Order ${order} Confirmation`,
//     text: `Thank you for your order! Order ID: ${order}`
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log('Error sending email:', error);
//     } else {
//       console.log('Email sent:', info.response);
//     }
//   });
// }
// //sendEmail("order")


let sendEmail = function (req, res) {
  const order = req.body.order_id;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '24eg204a18@anurag.edu.in',
      pass: 'au@123456'
    }
  });

  let mailOptions = {
    from: '24eg204a18@anurag.edu.in',
    to: 'vorebe3794@noroasis.com',
    subject: `Your Order ${order} Confirmation`,
    text: `Thank you for your order! Order ID: ${order}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      return res.status(500).json({ message: 'Email sending failed', error: error.toString() });
    } else {
      console.log('Email sent:', info.response);
      return res.status(200).json({ message: 'Email sent successfully', info: info.response });
    }
  });
};



module.exports={
  sendEmail:sendEmail
  //setDb:setDb
}
