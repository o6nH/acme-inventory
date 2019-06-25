const dbConn = require('.');//dbConn instead of just db to emphasize dbConn.sync() and dbConn.close()
const Products = require('./models/Products');

const products = [
  {name: 'Things'}, 
  {name: 'Stuff', status: 'Discontinued'}, 
  {name: 'Whatsits'}, 
  {name: 'Dinguses'}, 
  {name: 'Items', status: 'Backordered'}];

const seed = async () => {
  try {
    //DROP TABLE IF EXISTS, then sync all models
    //(i.e., drop 'products' table, then use const Products = db.defined('products, {...}) 
    // in `./models/Products` file)
    await dbConn.sync({force: true});

    //Model.build(values) and Model.save() by using Model.create(value)
    await Promise.all(products.map(products => Products.create(products)));

    dbConn.close();
  } catch(err) {
    console.error('Could not seed products!', err);
    dbConn.close();
  }
};

seed();