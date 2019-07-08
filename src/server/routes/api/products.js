const express = require('express');
const router = express.Router();
const Products = require('../../db/models/Products');

module.exports = router;

router.get('/products', async (req, res, next) => {
  try{
    res.send(await Products.findAll());
  }
  catch (err) {
    res.status(404).send(`
      <div>
        <h2>Cannot find products:</h2>
        ${err}
      </div>
    `)
  }
});

router.put('/products/:id', async (req, res, next) => {
  try {
    const product = await Products.findOne({
      where: {
        id: req.params.id
      }
    });

    
    //Specify the object of attributes to update, .save will only save for those in fields
    const newStatus = req.body.status;
    const allowedStatuses = Products.rawAttributes.status.values;
    //console.log(newStatus, allowedStatuses);
    
    if(allowedStatuses.includes(newStatus)){
      product.update({status: newStatus}, {fields:['status']});
      res.status(201).send(product);
    } else {
      throw `Error: The status of the product provided can only be one of the following: ${allowedStatuses}`
    }
  }
  catch(err) {
    console.error(err);
    //Why is res not sent????
    res.status(304).send(`
      <html>
        <div>
          <h2>Cannot find products:</h2>
          ${err}
        </div>
      </html>
    `)
  }
});