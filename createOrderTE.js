// let db
// function setDb(connection){
//     db=connection
// }
// let webhookUrl="https://webhook.site/b0f4e098-70bb-4064-914e-c661a6f1b1d3"
// async function sendWebhook(order) {
//     try {
//       const response = await axios.post(webhookUrl, {
//         order_id: order.id,
//         //customer_id: order.customer_id,
//         //total_amount: order.total_amount,
//       });
//       console.log('Webhook sent successfully:', response.status);
//     } catch (error) {
//       console.error('Error sending webhook:', error);
//     }
//   }
// function checkOrderProcessed(){
//     let processed_orders=[]
//     db.query(`select id from shop.orders where processed = 0`,(err,results)=>{
//         if(err){
//             console.log("Error while fetching ",err);            
//         }
//         if(results){
//             processed_orders=results
//         }
//     })
//     if(processed_orders.length>0){
//         processed_orders.forEach(async function(item){
//             await sendWebhook(item)
//             db.query('UPDATE orders set processed = 1 where id = ? ',[item.id],(err) => {
//                 if (err) {
//                   console.error('Error marking order as processed:', err);
//                 } else {
//                   console.log(`Order ${item.id} processed.`);
//                 }
//               })
//         })
//     }
// }
// setInterval(checkOrderProcessed,5000)
// module.exports={
//     setDb:setDb
// }

const axios = require('axios');
let db;

function setDb(connection) {
  db = connection;
}

let webhookUrl = "https://webhook.site/b0f4e098-70bb-4064-914e-c661a6f1b1d3";

async function sendWebhook(order) {
  try {
    const response = await axios.post(webhookUrl, {
      order_id: order.id,
      // You can add customer_id and total_amount here if needed.
    });
    console.log('Webhook sent successfully:', response.status);
  } catch (error) {
    console.error('Error sending webhook:', error);
  }
}

async function checkOrderProcessed() {
  try {
    // Query to get unprocessed orders
    db.query(`SELECT id FROM shop.orders WHERE processed = 0`, async (err, results) => {
      if (err) {
        console.log("Error while fetching orders:", err);
        return;
      }

      if (results && results.length > 0) {
        // Loop through each unprocessed order
        for (let item of results) {
          // Send webhook for each unprocessed order
          await sendWebhook(item);

          // Mark the order as processed after the webhook is sent
          db.query('UPDATE shop.orders SET processed = 1 WHERE id = ?', [item.id], (err) => {
            if (err) {
              console.error('Error marking order as processed:', err);
            } else {
              console.log(`Order ${item.id} processed.`);
            }
          });
        }
      }
    });
  } catch (err) {
    console.log('Error in checkOrderProcessed:', err);
  }
}

// Poll the database every 5 seconds
setInterval(checkOrderProcessed, 5000);

module.exports = {
  setDb: setDb
};
