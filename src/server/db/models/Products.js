const Sequelize = require('sequelize');
const db = require('..');

const Products = db.define('product', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }, 
  status: {
    type: Sequelize.ENUM('stocked', 'backordered', 'discontinued'),
    defaultValue: 'stocked'
  }
});

module.exports = Products;