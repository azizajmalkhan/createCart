const { DataTypes } = require("sequelize");
const sequelize = require("../config/database")
let Order;

try {
    Order = sequelize.define('Order', {
        order_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        total: {
            type: DataTypes.FLOAT(10, 6),
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        sub_total: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'orders'
    });

    sequelize.sync()
        .then(() => {
            console.log("✅ Order table created successfully.");
        })
        .catch((err) => {
            console.error("❌ Error during sequelize.sync():", err.message);
        });

} catch (err) {
    console.error("❌ Error while defining model:", err.message);
}

module.exports = Order;