const Order = require("../models/order")

//const createOrder = async (req, res) => {
// try {
// let body = req.body
// console.log("CreateOrderBody" + body);


//     let insertData = {
//         "order_number": body.order_number,
//         "status": body.status,
//         "total": body.total,
//         "sub_total": body.sub_total
//     }
//     let orderInserted = await Order.create(insertData)
//     return res.json({
//         data: orderInserted
//     }
//     )
// }
// catch (error) {
//     console.log("Craete order   error" + error);
//     return error;
// }



//}




// Define a single function to handle both variants and modifiers
const createOrder = async (req, res) => {
    let reqq = req.body;
    let variantIds = [];
    let modifierIds = [];
    let taxCategoryIds = [];

    // async function fetchDeliveryFee() {
    //     try {
    //         let deliveryFee = await getDeliveryFee();
    //         console.log("Delivery fee stored:", deliveryFee);
    //         return deliveryFee; // Wait for the promise to resolve
    //     } catch (error) {
    //         console.error("Error fetching delivery fee:", error);
    //         return null; // or handle the error as needed
    //     }
    // }

    if (reqq && reqq.data && reqq.data.order_details) {
        reqq.data.order_details.forEach(function (orderDetails) {
            variantIds.push(orderDetails.variant_id);
            taxCategoryIds.push(orderDetails.tax_category_id);
            if (orderDetails.selected_options && orderDetails.selected_options.length > 0 && orderDetails.selected_options[0].modifiers.length > 0) {
                orderDetails.selected_options[0].modifiers.forEach(function (modifier) {
                    modifierIds.push(modifier.id);
                    taxCategoryIds.push(modifier.tax_category_id);
                });
            }
            if (orderDetails.product_modifiers && orderDetails.product_modifiers.length > 0) {
                orderDetails.product_modifiers.forEach(function (prdModifier) {
                    taxCategoryIds.push(prdModifier.tax_category_id);
                    modifierIds.push(prdModifier.id);
                });
            }
        });
    }

    console.log("tax_category_id", taxCategoryIds);

    // let variantsQuery = "SELECT id as variant_id, price as variant_price FROM shop.variants WHERE id IN (?)";
    //let modifiersQuery = "SELECT id as modifier_id, price as modifier_price FROM shop.modifiers WHERE id IN (?)";
    // let taxQuery = "SELECT id as tax_id, tax_price as percentage FROM shop.tax WHERE id IN (?)";

    try {
        let variantsData = [];
        if (variantIds.length > 0) {
            // variantsData = await queryAsync(variantsQuery, [variantIds]);
            variantsData = [{ variant_price: 120, variant_id: 1 }, { variant_price: 120, variant_id: 2 }, { variant_price: 120, variant_id: 3 }]
        }
        console.log("variantsData", variantsData);

        let modifiersData = [];
        if (modifierIds.length > 0) {
            // modifiersData = await queryAsync(modifiersQuery, [modifierIds]);
        }

        let taxData = [];
        if (taxCategoryIds.length > 0) {
            // taxData = await queryAsync(taxQuery, [taxCategoryIds]);
            taxData = [{ tax_id: 1, percentage: 10 }, { tax_id: 2, percentage: 10 }]
            console.log(taxData);
        }

        let totalPrice = subTotal(reqq, variantsData, modifiersData);
        console.log(totalPrice);
        let taxTotalAmount = taxTotal(totalPrice, reqq.data, taxData, reqq.data.is_coupon_applied, reqq.data.coupon_data, reqq.data.is_reward_redeemed, reqq.data.redeem_data);
        console.log(taxTotalAmount);


        //let deliveryFee = await fetchDeliveryFee();

        let deliveryFee = 0
        let payment_total = Number(totalPrice) + Number(taxTotalAmount) + Number(deliveryFee)
        console.log("payment_total : " + payment_total);
        // let order_columns = ["sub_total", "delivery_fee", "tax_total", "payment_total"]
        // let values = [totalPrice, deliveryFee, taxTotalAmount, payment_total]
        // orderInsert(order_columns, values)



        let insertData = {
            "order_number": "ERE343",
            "status": "pending",
            "total": payment_total,
            "sub_total": totalPrice
        }
        let orderInserted = await Order.create(insertData)
        return res.json({
            data: orderInserted
        })

        // res.json({
        //     variants: variantsData,
        //     modifiers: modifiersData,
        //     taxData: taxData,

        //     tax_total: taxTotalAmount,
        //     subtotal: totalPrice,
        //     delivery: deliveryFee
        // });

    } catch (error) {
        // Handle any errors during the queries
        res.status(500).json({ error: error, details: error });
    }
};

function subTotal(reqq, variants, modifiers) {
    let subTotal = 0;
    if (reqq && (variants || modifiers)) {
        if (reqq.data && reqq.data.order_details && reqq.data.order_details.length > 0) {
            reqq.data.order_details.forEach(function (item) {
                let price = 0;
                if (variants && variants.length > 0) {
                    variants.forEach(function (variantItem) {
                        if (variantItem.variant_id == item.variant_id) {
                            price += variantItem.variant_price;
                        }
                    });
                }

                // if (item.selected_options && item.selected_options[0].modifiers && item.selected_options[0].modifiers.length > 0) {
                //     price += getModifiersPrice(item.selected_options[0].modifiers, modifiers);
                // }
                // if (item.product_modifiers && item.product_modifiers.length > 0) {
                //     price += getModifiersPrice(item.product_modifiers, modifiers);
                // }

                subTotal += price * Number(item.quantity);
            });
        }
    }

    function getModifiersPrice(inputModifiers, modifiers) {
        let modifiersPrice = 0;
        if (inputModifiers && modifiers) {
            inputModifiers.forEach(function (item) {
                modifiers.forEach(function (modifierItem) {
                    if (item.id == modifierItem.modifier_id) {
                        modifiersPrice += modifierItem.modifier_price * item.quantity;
                    }
                });
            });
        }
        return modifiersPrice;
    }

    return subTotal;
}

function taxTotal(totalPrice, initialData, taxData, isCouponApplied, couponData, isRewardRedeemed, redeemData) {
    let taxSubTotal = 0;
    if (initialData && taxData) {
        if (initialData.order_details.length > 0) {
            initialData.order_details.forEach(function (initial) {
                taxData.forEach(function (tax) {
                    if (initial.tax_id == tax.tax_id) {
                        let productShare = (totalPrice > 0) ? (Number(initial.price) * Number(initial.quantity) / totalPrice) : 0;
                        let discountedPrice = applyDiscount(productShare, initial.price, initial.quantity);
                        taxSubTotal += calculateTax(discountedPrice, Number(tax.percentage));
                        if (initial.selected_options && initial.selected_options[0].modifiers.length > 0) {
                            initial.selected_options[0].modifiers.forEach(function (optionModifier) {
                                taxData.forEach(function (taxData) {
                                    if (taxData.tax_id == optionModifier.tax_category_id) {
                                        let productShare = (totalPrice > 0) ? (Number(optionModifier.default_price) * Number(optionModifier.quantity) * Number(initial.quantity) / totalPrice) : 0;
                                        let discountedPrice = applyDiscount(productShare, initial.price, Number(optionModifier.quantity) * Number(initial.quantity));
                                        taxSubTotal += calculateTax(discountedPrice, tax.percentage);
                                    }
                                });
                            });
                        }
                    }
                });
                if (initial.product_modifiers && initial.product_modifiers.length > 0) {
                    initial.product_modifiers.forEach(function (prdModifier) {
                        taxData.forEach(function (tax) {
                            if (tax.tax_id == prdModifier.tax_category_id) {
                                let productShare = (totalPrice > 0) ? (Number(prdModifier.default_price) * Number(prdModifier.quantity) * Number(initial.quantity) / totalPrice) : 0;
                                let discountedPrice = applyDiscount(productShare, initial.price, Number(prdModifier.quantity) * Number(initial.quantity));
                                taxSubTotal += calculateTax(discountedPrice, tax.percentage);
                            }
                        });
                    });
                }
            });
        }

        function applyDiscount(productShare, price, quantity) {
            let finalProduct = price * quantity;
            if (couponData) {
                if (couponData.discount_type == "amount") {
                    let couponDiscountShare = couponData.amount * productShare;
                    finalProduct -= couponDiscountShare;
                }
                if (couponData.discount_type == "percentage") {
                    let discountPercentage = Number(couponData.percentage) / 100;
                    let promotionAmount = totalPrice * (1 - discountPercentage);
                    let discountedPrice = totalPrice - promotionAmount;
                    if (discountedPrice < couponData.percentage_limit) {
                        let discountedProductPrice = finalProduct * (1 - discountPercentage);
                        finalProduct -= discountedProductPrice;
                    } else {
                        let couponDiscountShare = couponData.percentage_limit * productShare;
                        finalProduct -= couponDiscountShare;
                    }
                }
            }
            // Uncomment and handle reward redemption if needed
            // if (tempRedeemData) {
            //     if (tempRedeemData.data && tempRedeemData.data.value) {
            //         var reward_discount_share = Number(tempRedeemData.data.value) * product_share;
            //         final_price -= reward_discount_share;
            //     }
            // }
            return finalProduct.toFixed();
        }

        function calculateTax(discountedPrice, taxPercentage) {
            let productTax = 0;
            if (discountedPrice) {
                productTax = (discountedPrice) * taxPercentage / 100;
            }
            return productTax;
        }
    }
    return taxSubTotal.toFixed(2);
}


module.exports = createOrder


