// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('shop', 'root', 'Test@123', {
//     host: 'localhost',
//     dialect: 'mysql'
// });

// sequelize.authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });

// const Variant = sequelize.define('variants', {
//     name: {
//         type: DataTypes.STRING, // Changed to STRING for name
//         allowNull: true
//     },
//     tax_category_id: {
//         type: DataTypes.INTEGER, // Changed to INTEGER for tax_category_id
//         allowNull: true
//     },
//     description: {
//         type: DataTypes.TEXT,
//         allowNull: true
//     },
// }, {
//     tableName: 'variants'
// });

// sequelize.sync()
//     .then(() => {
//         console.log('Product table has been created.');
//     });

// module.exports = Variant;

// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('shop', 'root', 'Test@123', {
//     host: 'localhost',
//     dialect: 'mysql'
// });

// sequelize.authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });

// const Variant = sequelize.define('variants', {
    // name: {
    //     type: DataTypes.STRING,
    //     allowNull: true
    // },
//     tax_category_id: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//     },
//     description: {
//         type: DataTypes.TEXT,
//         allowNull: true
//     },
//     product_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//             model: 'products', // Name of the table that contains the products
//             key: 'id' // Key in the products table that we're referencing
//         }
//     }
// }, {
//     tableName: 'variants'
// });

// sequelize.sync()
//     .then(() => {
//         console.log('Variants table has been created.');
//     });

// module.exports = Variant;

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('shop', 'root', 'Test@123', {
    host: 'localhost',
    dialect: 'mysql'
});
let Product = require('../productModule')
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const Variant = sequelize.define('variants', {
        name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tax_category_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      //  references: {
      //      model: Product,
      //      key: 'id'
      //  }
    }
}, {
    tableName: 'variants'
});

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Variants table has been updated.')
    })
    .catch (err => {
    console.error('Unable to update the table:', err);
});
// .then(() => {
//     console.log('Variants table has been updated.');
// })
// .catch(err => {
//     console.error('Unable to update the table:', err);
// });
module.exports = Variant;

