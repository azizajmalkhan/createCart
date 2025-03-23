const nodemailer = require('nodemailer');
//const twilio = require('twilio');

// MySQL database connection
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'yourpassword',
//   database: 'your_database'
// });

// Send email function
function sendEmail(order) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '24eg204a18@anurag.edu.in',
      pass: 'au@123456'
    }
  });

  let mailOptions = {
    from: '24eg204a18@anurag.edu.in',
    to: 'nowik37917@amgens.com',
    subject: `Your Order ${order} Confirmation`,
    text: `Thank you for your order! Order ID: ${order}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}
sendEmail("order")



