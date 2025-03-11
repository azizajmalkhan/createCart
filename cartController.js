const loginController = require("./loginController");
const getdeliveryFee = require("./getDeliveryCharges")
let db;  // Declare a variable to hold the DB connection

// This method sets the DB connection
function setDb(connection) {
    db = connection;
}

function queryAsync(sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, function (err, results) {
            if (err) {
                console.error('Query failed:', err.message); // Log the message
                console.error('Stack trace:', err.stack);   // Log the stack trace
                reject({
                    message: 'Query failed',
                    error: err, 
                    query: sql, 
                    params: params
                });
            } else {
                resolve(results);
                console.log(results);
                
            }
        });
    });
}



// Define a single function to handle both variants and modifiers
const createCart = async (req, res) => {

    let reqq = req.body
    //debugger;
    var variant_ids = [];
    let modifiers_ids = [];
    let tax_category_ids = []

    
async function delivery_fee() {
    try {
       let  delivery_fee = await getdeliveryFee();
       console.log("Delivery fee stored:", delivery_fee); 
        return delivery_fee // Wait for the promise to resolve
      
    } catch (error) {
        console.error("Error fetching delivery fee:", error);
    }
}

    if (reqq && reqq.data && reqq.data.order_details) {
        reqq.data.order_details.forEach(function (order_details) {
            variant_ids.push(order_details.variant_id)
            tax_category_ids.push(order_details.tax_category_id)
            if (order_details.selected_options && order_details.selected_options.length > 0 && order_details.selected_options[0].modifiers.length > 0) {

                order_details.selected_options[0].modifiers.forEach(function (modifiers) {
                    modifiers_ids.push(modifiers.id)
                    tax_category_ids.push(modifiers.tax_category_id)
                })
            }
            if (order_details.product_modifiers && order_details.product_modifiers.length > 0) {
                order_details.product_modifiers.forEach(function (prd_modifiers) {
                    tax_category_ids.push(prd_modifiers.tax_category_id)
                    modifiers_ids.push(prd_modifiers.id)
                })
            }
        })
    }

    console.log("tax_category_id" ,tax_category_ids);
    
   var variantsQuery = "SELECT id as variant_id,price as variant_price  FROM shop.variants where id in (?)";
    let modifiersQuery = "SELECT id as modifier_id,price as modifier_price FROM shop.modifiers where id in (?)";
    //
    let taxQuery = "SELECT id as tax_id,tax_price as percentage FROM shop.tax where id in (?)";
    try {
        // Run both queries concurrently using Promise.all
        // const [variantsData, modifiersData] = await Promise.all([
        //     queryAsync(variantsQuery),
        //     queryAsync(modifiersQuery)
        // ]);


        // const variantsData = await queryAsync(variantsQuery, [variant_ids])
        // const modifiersData = await queryAsync(modifiersQuery, [modifiers_ids])


        var variantsData = []
        if (variant_ids.length > 0) {
            variantsData = await queryAsync(variantsQuery, [variant_ids])
        }
        console.log("variantsData",variantsData);
        
        var modifiersData = []
        if (modifiers_ids.length > 0) {
            modifiersData = await queryAsync(modifiersQuery, [modifiers_ids])
        }
      
        if (tax_category_ids.length > 0) {
            var taxData = await queryAsync(taxQuery, [tax_category_ids]);
            console.log(taxData);
            
        }
        console.log(tax_category_ids);
        
        var tax_total = 0;
       

        let reqq;
        if (typeof req.body === 'string') {
            reqq = JSON.parse(req.body);
        } else {
            reqq = req.body;
        }
        console.log(reqq);

        //console.log(subTotal(reqq,variants,modifiers));
        var total_price = 0
        total_price = subTotal(reqq, variantsData, modifiersData)

        console.log(total_price);
        console.log(taxTotal(total_price, reqq.data, taxData, reqq.data.is_coupon_applied, reqq.data.coupon_data, reqq.data.is_reward_redeemed, reqq.data.redeem_data));

        function subTotal(reqq, variants, modifiers) {
            let sub_total = 0;
            if (reqq && variants || modifiers) {
                if (reqq.data && reqq.data.order_details && reqq.data.order_details.length > 0) {
                    reqq.data.order_details.forEach(function (item) {
                        let price = 0
                        if (variants && variants.length > 0) {
                            variants.forEach(function (variant_item) {
                                if (variant_item.variant_id == item.variant_id) {
                                    price += variant_item.variant_price
                                }
                            })
                        }


                        if (item.selected_options && item.selected_options[0].modifiers && item.selected_options[0].modifiers.length > 0) {
                            price += getmodifiersPrice(item.selected_options[0].modifiers, modifiers)
                        }
                        if (item.product_modifiers && item.product_modifiers.length > 0) {
                            price += getmodifiersPrice(item.product_modifiers, modifiers)

                        }

                        sub_total += price * Number(item.quantity)
                    })
                }
            }


            function getmodifiersPrice(input_modifiers, modifiers) {
                let modifiers_price = 0
                if (input_modifiers && modifiers) {
                    input_modifiers.forEach(function (item) {
                        modifiers.forEach(function (modifier_item) {
                            if (item.id == modifier_item.modifier_id) {
                                modifiers_price += modifier_item.modifier_price * item.quantity
                            }
                        })
                    })
                }
                // console.log(price);

                return modifiers_price
            }


            return sub_total

        }


        // observe quantity 3 modifiers * product qunatity 
        // 10 * 3 * 2
        //modifiers is 3 quantity and products 2 quantity 

        //let total_tax = taxTotal(total_price,reqq.data, tax_data,is_coupon_applied, reqq.data.coupon_data, reqq.data.is_reward_redeemed, reqq.data.redeem_data)
        //console.log(total_tax);
        function taxTotal(total_price, initial_data, tax_data, is_coupon_applied, coupon_data, is_reward_redeemed, redeem_data) {

            let tax_sub_total = 0;
            if (initial_data && tax_data) {
                if (initial_data && initial_data.order_details.length > 0) {
                    initial_data.order_details.forEach(function (initial) {
                        tax_data.forEach(function (tax) {
                            if (initial.tax_id == tax.tax_id) {
                                let product_share = (total_price > 0) ? (Number(initial.price) * Number(initial.quantity) / total_price) : 0
                                let discounted_price = applyDiscount(product_share, initial.price, initial.quantity)
                                tax_sub_total += calculateTax(discounted_price, Num(tax.percentage))
                                if (initial.selected_options && initial.selected_options && initial.selected_options[0].modifiers.length > 0) {
                                    initial.selected_options[0].modifiers.forEach(function (option_modifiers) {
                                        tax_data.forEach(function (tax_data) {
                                            if (tax_data.tax_id == option_modifiers.tax_category_id) {
                                                let product_share = (total_price > 0) ? (Number(option_modifiers.default_price) * Number(option_modifiers.quantity) * Number(initial.quantity) / total_price) : 0
                                                let discounted_price = applyDiscount(product_share, initial.price, Number(option_modifiers.quantity) * Number(initial.quantity))
                                                tax_sub_total += calculateTax(discounted_price, tax.percentage)
                                            }
                                        })
                                    })
                                }

                            }
                        })
                        if (initial.product_modifiers && initial.product_modifiers.length > 0) {
                            initial.product_modifiers.forEach(function (prd_modifiers) {
                                tax_data.forEach(function (tax) {
                                    if (tax.tax_id == prd_modifiers.tax_category_id) {
                                        let product_share = (total_price > 0) ? (Number(prd_modifiers.default_price) * Number(prd_modifiers.quantity) * Number(initial.quantity) / total_price) : 0
                                        let discounted_price = applyDiscount(product_share, initial.price, Number(prd_modifiers.quantity) * Number(initial.quantity))
                                        tax_sub_total += calculateTax(discounted_price, tax.percentage)
                                    }
                                })
                            })
                        }
                    })
                }

                function applyDiscount(product_share, price, quantity) {
                    let final_product = price * quantity
                    if (coupon_data) {
                        if (coupon_data.discount_type == "amount") {
                            let coupon_discount_share = coupon_data.amount * product_share
                            let final_product = final_product - coupon_discount_share
                        }
                        if (coupon_data.discount_type == "percentage") {
                            let discount_percentage = Number(coupon_data.percentage) / 100
                            let promotion_amount = total_price * (1 - discount_percentage)
                            let discounted_price = total_price - promotion_amount
                            if (discounted_price < coupon_data.percentage_limit) {
                                let discounted_product_price = final_product * (1 - discount_percentage)
                                final_product -= discounted_product_price
                            }
                            else {
                                let coupon_discount_share = (coupon_data.percentage_limit) * product_share
                                final_product -= coupon_discount_share
                            }
                        }
                        //console.log(promotion_amount);
                    }

                    // if (tempRedeemData) {
                    //     if (tempRedeemData.data && tempRedeemData.data.value) {
                    //         var reward_discount_share = Number(tempRedeemData.data.value) * product_share;
                    //         final_price -= reward_discount_share;
                    //         // var discounted_price = total_product_price - discount_share;
                    //         // console.log("Discount", Math.max(discounted_price / quantity, 0));
                    //         //return Math.max(discounted_price / quantity, 0);
                    //         //return discounted_price;
                    //     }
                    // }
                    return final_product.toFixed()
                }
            }

            function calculateTax(discounted_price, tax_percentage) {
                product_tax = 0
                if (discounted_price) {
                    product_tax = (discounted_price) * tax_percentage / 100
                }
                return product_tax

            }

            return tax_sub_total
        }

    }catch (error) {
        // Handle any errors during the queries
        res.status(500).json({ error: 'Database query failed', details: error });
    }

    let delivery_feee = await delivery_fee()
   
    res.json({
        variants: variantsData,
        modifiers: modifiersData,
        taxData: taxData,
        tax_total: tax_total,
        delivery:delivery_feee
    });

    // res = {
    //     variants: variantsData,
    //     modifiers: modifiersData
    // }
} 

//let value = createCart()

//console.log(value);

// Export the setDb method and the createCart function
module.exports = {
    setDb: setDb,
    createCart: createCart
};
