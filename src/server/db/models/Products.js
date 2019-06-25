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
    type: Sequelize.ENUM('instock', 'backorder', 'discontinued'),
    defaultValue: 'instock'
  }
});

module.exports = Products;