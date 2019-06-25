const db = require('./db');
const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;

// Models
const Products = require('./db/models/Products'); 
// Associations: N/A

// Express Server App
const app = express();

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api', require('./routes/api/products'));

// Static Middleware
// Serves dist/index.html
app.get('/', express.static(path.join(__dirname, '../../dist/')));

// Sync DB then Express Listens 
db.sync()
  .then(() => {
    console.log('DB synced!');
    app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });
  });


  