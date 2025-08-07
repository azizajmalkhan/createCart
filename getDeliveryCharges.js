const jwt = require('jsonwebtoken')
const axios = require('axios')
async function getdeliveryFee() {
  const accessKey = {
      "developer_id": "40071e0c-b782-4786-9b7b-07b06918430f",
      "key_id": "f7b6161c-5695-4ba1-b819-fa6c105c7f24",
      "signing_secret": "KmFOjeCDwuo2wFuwB0FtvlyIMbYCcR0qGqeGjQ_VuT0"
  };

  const data = {
      aud: 'doordash',
      iss: accessKey.developer_id,
      kid: accessKey.key_id,
      exp: Math.floor(Date.now() / 1000 + 300),
      iat: Math.floor(Date.now() / 1000),
  };

  const headers = { algorithm: 'HS256', header: { 'dd-ver': 'DD-JWT-V1' } };

  const token = jwt.sign(
      data,
      Buffer.from(accessKey.signing_secret, 'base64'),
      headers,
  );

  console.log(token);

  const body = JSON.stringify({
      external_delivery_id: 'D-12392',
      pickup_address: '901 Market Street 6th Floor San Francisco, CA 94103',
      pickup_business_name: 'Wells Fargo SF Downtown',
      pickup_phone_number: '+16505555555',
      pickup_instructions: 'Enter gate code 1234 on the callbox.',
      dropoff_address: '901 Market Street 6th Floor San Francisco, CA 94103',
      dropoff_business_name: 'Wells Fargo SF Downtown',
      dropoff_phone_number: '+16505555555',
      dropoff_instructions: 'Enter gate code 1234 on the callbox.',
      order_value: 1999,
      contactless_dropoff: false,
      action_if_undeliverable: "return_to_pickup",
      items: [
          {
              name: "Chicken Burrito",
              quantity: 2,
              description: "A tasty oversized burrito with chicken, rice, beans, and cheese.",
              external_id: "12353",
          }
      ]
  });


  const response = await axios.post('https://openapi.doordash.com/drive/v2/quotes', body, {
      headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
      },
  });

  const result = response;
  if (result && result.data) {
      return result.data.fee;
  }


  return 0;
}

// delivery_fee =await getdeliveryFee().then((fee) => fee);
// console.log(delivery_fee);


//getDeliveryFee().then(fee => console.log(fee));

//let delivery_fee = 0
// getDeliveryFee().then((fee) => {
//     delivery_fee = fee
// }
// );
// console.log(delivery_fee);
//let result = delivery_fee.then((fee) => console.log(fee));
// let result = delivery_fee.then((fee) => fee);

// console.log(result);


// let delivery_fee =await getDeliveryFee().then((fee) => fee);
// console.log(delivery_fee);


//getDeliveryFee().then(fee => console.log(fee));

let delivery_fee = 0
// getDeliveryFee().then((fee) => {
//     delivery_fee = fee
// }
// );
// console.log(delivery_fee);
//let result = delivery_fee.then((fee) => console.log(fee));
// let result = delivery_fee.then((fee) => fee);

// console.log(result);

console.log(delivery_fee);
// module.exports={
//   delivery_fee : getdeliveryFee
// }
module.exports = getdeliveryFee;