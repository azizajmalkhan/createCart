// app.post('/obj/:object_name', (req, res) => {
//  //   const { object_name } = req.params;
//     const data = req.body;

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

let postData = async function (req, res) {
    let inserted_data = {}
    if (req) {
        let reqq = req.body
        const object_name = req.params.object_name;
        if (typeof reqq == "string") {
            reqq = JSON.parse(reqq)
        }
        const keys = Object.keys(reqq).join(', ');
        const values = Object.values(reqq);
        const placeholders = values.map(() => '?').join(', ');
        let insert_query = `INSERT INTO shop.${object_name} (${keys}) VALUES (${placeholders})`

        inserted_data = await queryAsync(insert_query, values)
    }
    return res.json({
        inserted_data: inserted_data
    })

}
let updateData = async function (req, res) {
    let updated_data = {};
    if (req) {
        let object_name = req.params.object_name; // Table name (e.g., 'practice')
        let id = req.params.id; // ID to identify the record to update
        let reqq = req.body; // The data to update (from the request body)

        let keys = Object.keys(reqq); // Get the keys (column names)
        let values = Object.values(reqq); // Get the values (updated data)

        // Generate the SET clause dynamically
        let set_clause = keys.map((key) => key + '= ?').join(', ');

        // Generate the full update query string
        let update_query = `UPDATE ${object_name} SET ${set_clause} WHERE id = ${id}`;

        console.log('Generated SQL:', update_query); // Debugging: Check generated query
        try {
            // Pass values and the id for the WHERE clause (add id as the last parameter)
            updated_data = await queryAsync(update_query, [...values, id]);

            // Return the updated data (or a success message)
            return res.json({
                message: 'Record updated successfully!',
                updated_data: updated_data
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error updating record',
                error: error.message
            });
        }
        // Execute the query
        // updated_data =await queryAsync(update_query, values); // Pass values + id for WHERE clause

        //  Return the updated data (or a success message)
        // return res.json({
        //     updated_data: updated_data
        // });
    }
};

let getData = async function (req, res) {
    let get_data =""
    let object_name=req.params.object_name
    let select_query = `select * from ${object_name}`
    try {
        // Pass values and the id for the WHERE clause (add id as the last parameter)
        get_data = await queryAsync(select_query)
        // Return the updated data (or a success message)
        return res.json({
            get_data: get_data
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating record',
            error: error.message
        });
    }
}
let deleteData = async function (req, res) {
    let delete_data =""
    let object_name=req.params.object_name
    let record_id = req.params.id
    let delete_query = `delete from ${object_name} where id = ? `
    try {
        // Pass values and the id for the WHERE clause (add id as the last parameter)
        delete_data = await queryAsync(delete_query,[record_id])
        // Return the updated data (or a success message)
        return res.json({
            delete_data: delete_data
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating record',
            error: error.message
        });
    }
}


module.exports = {
    setDb: setDb,
    postData: postData,
    updateData: updateData,
    getData:getData,
    deleteData:deleteData
};
//     if (object_name && data) {
//         const keys = Object.keys(data).join(', ');
//         const values = Object.values(data);
//         const placeholders = values.map(() => '?').join(', ');

//         //const sql = INSERT INTO shop.${object_name} (${keys}) VALUES (${placeholders});

//         db.query(sql, values, (err, result) => {
//             if (err) throw err;
//             res.send(Inserted values into ${ object_name });
//         });
//     } else {
//         res.send('Please provide valid object_name and data.');
//     }
// });