const express = require('express');
const router = express.Router();

module.exports = router;

router.get('/products', (req, res, next) => {
  res.send('<h1>HI</h1>');
});

router.get('/products/:id', (req, res, next) => res.send(req.params.id));