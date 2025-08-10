const emailQueue = require("./Queues/OrderEmailQueue")
const sendOrderPlacedEmail = require("./EmailServices/OrderReceiveEmail")


try {
console.log("worker strted ....");

   // const emailQueue = require("./Queues/OrderEmailQueue");

    // Listen for jobs

    emailQueue.process(async (job) => {
        console.log("worker strted and process started....");
        // console.log("Data:", job.data.orderId);
        // console.log("Full job data:", job.data);
        sendOrderPlacedEmail(job.data.id)
        // // Simulate sending email
        // await new Promise(resolve => setTimeout(resolve, 1000));
        // console.log(`📧 Email sent to ${job.data.email}`);
    });

} catch (error) {
    console.log("process : ", error);

}
