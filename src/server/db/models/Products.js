const Sequelize = require('sequelize');
const db = require('..');

const Products = db.define('product', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }, 
  status: {
    type: Sequelize.ENUM('instock', 'backorder', 'discontinued')
  }
});

module.exports = Products;