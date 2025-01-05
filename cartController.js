const loginController = require("./loginController");
let db;  // Declare a variable to hold the DB connection

// This method sets the DB connection
function setDb(connection) {
    db = connection;
}

// Function to query the DB asynchronously
function queryAsync(sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

// Define a single function to handle both variants and modifiers
const createCart = async (req, res) => {

    let reqq = req.body
    let variant_ids =[];
    let modifiers_ids =[];
    let tax_category_ids =[]
    if(reqq && reqq.variants){
        reqq.variants.forEach(function(item){
            if(item){
                variant_ids.push(item.id)
            }
        })
    }
    if(reqq && reqq.modifiers){
        reqq.modifiers.forEach(function(item){
            if(item){
                modifiers_ids.push(item.id)
            }
        })
    }
    // Define queries for variants and modifiers
    let variantsQuery = "SELECT * FROM shop.variants where id in (?)";
    let modifiersQuery = "SELECT * FROM shop.modifiers where id in (?)";
    let taxQuery = "SELECT * FROM shop.tax where id in (?)";
    try {
        // Run both queries concurrently using Promise.all
        // const [variantsData, modifiersData] = await Promise.all([
        //     queryAsync(variantsQuery),
        //     queryAsync(modifiersQuery)
        // ]);


        const variantsData = await queryAsync(variantsQuery,[variant_ids])
        const modifiersData = await queryAsync(modifiersQuery,[modifiers_ids])
        //const taxData = await queryAsync(taxQuery,[tax_category_ids])
        //const tax_data = await 
        if(variantsData){
            variantsData.forEach(function(item){
                tax_category_ids.push(item.tax_category_id)
            })
        }
        if(modifiersData){
            modifiersData.forEach(function(item){
                tax_category_ids.push(item.tax_category_id)
            })
        }

        if (tax_category_ids.length > 0) {
            var taxData = await queryAsync(taxQuery, [tax_category_ids]);
        }
        let tax_total = 0;
        //const taxData = await queryAsync(taxQuery,[tax_category_ids])
        if (taxData && (modifiersData || variantsData)) {
            if(taxData && modifiersData){
                modifiersData.forEach(function(item){
                   taxData.forEach(function(taxx){
                    if(item.tax_category_id == taxx.id){
                        tax_total += item.price*taxx.tax_price/100
                    }
                   })
                })
                    
                

            }
        }
          
        // Send the response with both variants and modifiers data
        res.json({
            variants: variantsData,
            modifiers: modifiersData,
            taxData:taxData,
            tax_total : tax_total
        });

        // res = {
        //     variants: variantsData,
        //     modifiers: modifiersData
        // }
    } catch (error) {
        // Handle any errors during the queries
        res.status(500).json({ error: 'Database query failed', details: error });
    }
};

// Export the setDb method and the createCart function
module.exports = {
    setDb: setDb,
    createCart: createCart
};
