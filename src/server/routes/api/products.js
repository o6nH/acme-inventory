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

    //Specify object of attributes, .save will only run those in fields
    product.update({status: req.body.status}, {fields:['status']})

    res.status(201).send(product);
  }
  catch(err) {
    res.status(304).send(`
      <div>
        <h2>Cannot find products:</h2>
        ${err}
      </div>
    `)
  }
});