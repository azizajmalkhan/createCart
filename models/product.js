const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('shop', 'root', 'Test@123', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING, // Changed to STRING for name
    allowNull: true
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.JSON,
    allowNull: true
 }}, {
  tableName: 'products'
});

sequelize.sync()
  .then(() => {
    console.log('Product table has been created.');
  });

module.exports = Product;