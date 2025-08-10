const nodemailer = require("nodemailer");


const node_transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "24eg204a18@anurag.edu.in", // Your Gmail
        pass: ""       // Your App Password
    }
});

const sendOrderReceiveEmail =
    async (order_details) => {
        try{
        let info = await node_transporter.sendMail({
            from: '24eg204a18@anurag.edu.in',
            to: 'khanazizajmal@gmail.com',
            subject: `Order Confirmation - Order #${order_details}`,
            text: `Thank you for your order! Your order ID is ${order_details}.`
        });
        console.log("✅ Email sent:", info.messageId);
        } catch (error) {
    console.error("❌ Error from sendEmails:", error);
}
    };

// await sendOrderReceiveEmail("ushdjhn");


module.exports = sendOrderReceiveEmail
