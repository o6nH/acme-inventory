# Backend Setup
In our backend, the `express` module will listen for HTTP Requests on port `3000`, then query a **PostgreSQL** database on port `5432`. 

SQL queries are made by the [<abbr title="Object-Relational Mapping">ORM</abbr>](https://www.google.com/search?q=orm) module, `sequelize`, and handled by the PostgreSQL client module, `pg`.

## File Structure
In the root `acme-inventory` project folder, create a `src` folder with `client` and `server` subfolders.

```bash
cd acme-inventory
mkdir src
cd src
mkdir client
mkdir server
cd server
mkdir db
mkdir routes
cd db
mkdir models
cd ../routes
mkdir api
```

## Initialize NPM's `package.json`
In the root project folder, create the `package.json` file.

```bash
npm init
```
> [!Note]: `node.js` includes `npm`.

## Install Server Modules
Install the necessary server modules: 

```bash
npm install express, sequelize, pg, pg-hstore
```

## PostgreSQL Server Connection with Sequelize
Install [PostgreSQL](https://www.postgresql.org/download/). 

Assuming the default username was kept (`postgres`), create a database called `inventory` in the terminal.

```bash
createdb.exe -U postgres inventory
```

If a `password` is saved in a `pass.js` file, we can create a connection to a PostgreSQL server/database with the following code:

```javascript
const Sequelize = require('sequelize');
const password = require('./pass');

//Create Postgres DB in Terminal with: `createdb.exe -U postgres inventory`
const db = new Sequelize('inventory', 'postgres', password, {
  dialect: 'postgres',
  host: 'localhost',
  //port: process.env.DB_PORT||5432,
  logging: false
});

db.authenticate()
  .then(()=>{
    console.log('DB Connection was successful.');
  })
  .catch(err => {
    console.error('Unable to connect to DB: ', err);
  });

module.exports = db;
```
> [!WARNING] **RE: GIT** 
> Exclude both `node_modules` and `src/server/db/pass.js` from the **git repo**.
> Add these to the `.gitignore` before commiting.

## Express Server and Routes
Express will handle HTTP requests as shown here:

```javascript
const db = require('./db');
const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;

// Models
const Products = require('./models/Products'); 

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
app.get('/', express.static(path.join(__dirname, '../../dist')));

// Sync DB then Express Listens 
db.sync()
  .then(() => {
    console.log('DB synced!');
    app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });
  });
```
### Basic API Routes
Routes may redirect to pages or an api. Here the routes are a part handle api calls.

```javascript
const express = require('express');
const router = express.Router();
const db = require('../../db');

module.exports = router;

router.get('/products', (req, res, next) => {
  res.send('<h1>HI</h1>');
});

router.get('/products/:id', (req, res, next) => res.send(req.params.id));
```

### Test Server
When `node` runs `./src/server/index.js`, Express should begin to listen on port `3000`.

The routes can be tested with [Postman](https://www.getpostman.com/) or browser.

> [!NOTE]
> Define `script.start:dev` property in the the `package.json` file that will run Express, and, in turn, listen for incoming HTTP requests.
>
>```json
>{
>  "scripts": {
>    "start:dev": "nodemon src/server/index.js --ignore dist --ignore src"
>  }
>}
>```
>```bash
> npm run start:dev
>```
>

### Install Webpack, Babel, and React
```bash
npm i --save-dev webpack, webpack-cli 
npm i --save-dev babel-loader, babel-polyfill, @babel/core
npm i --save-dev @babel/preset-react, @babel/plugin-proposal-class-properties
npm i --save-dev html-webpack-plugin
npm i --save-dev react, react-dom, react-router-dom
```
Create a Webpack config file `webpack.config.js`.

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './src/client/index.js'],
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/client/index.html'
    })
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
}
```

Create a `.babelrc` file
```json
{
  "presets": ["@babel/preset-react"],
  "plugins": ["@babel/plugin-proposal-class-properties"]
}
```

> [!NOTE]
> Define `script.webpack:dev` and include it in the `script.start:dev` property in the the `package.json` file.
>
>```json
>{
>  "name": "acme-inventory",
>  "version": "1.0.0",
>  "description": "practice with react, express, and sequelize",
>  "main": "index.js",
>  "scripts": {
>    "webpack:dev": "webpack --mode=development --watch",
>    "start:dev": "nodemon src/server --ignore dist --ignore src & npm run webpack:dev"
>  },
>  "repository": {
>    "type": "git",
>    "url": "git+https://github.com/o6nH/acme-inventory.git"
>  },
>  "keywords": [
>    "react",
>    "git",
>    "webpack",
>    "babel",
>    "express",
>    "sequelize"
>  ],
>  "author": "Hugo Campos",
>  "license": "ISC",
>  "bugs": {
>    "url": "https://github.com/o6nH/acme-inventory/issues"
>  },
>  "homepage": "https://github.com/o6nH/acme-inventory#readme",
>  "dependencies": {
>    "express": "^4.17.1",
>    "pg": "^7.11.0",
>    "sequelize": "^5.8.12"
>  },
>  "devDependencies": {
>    "@babel/core": "^7.4.5",
>    "@babel/plugin-proposal-class-properties": "^7.4.4",
>    "@babel/preset-react": "^7.0.0",
>    "babel-loader": "^8.0.6",
>    "babel-polyfill": "^6.26.0",
>    "html-webpack-plugin": "^3.2.0",
>    "react": "^16.8.6",
>    "react-dom": "^16.8.6",
>    "react-router-dom": "^5.0.1",
>    "webpack": "^4.35.0",
>    "webpack-cli": "^3.3.5"
>  }
>}
>```
>
>```bash
> npm run start:dev
>```
>

## Create Tables/Models in PostgreSQL Database
Define a **schema** for the **models/tables** that will be added to our database above (*[`inventory`](#PostgreSQL-Server-Connection-with-Sequelize)*); use the Sequelize instance method `define()` built-in to the new Sequelize connection (`db`) established above. Include the model name and attributes with their options (like type and validation).

```javascript
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
```

## Sync and Seed Data
With `DBInstance.sync({force:true})`, force the database connection to **drop old data tables/models** and synchronize with the *models* that were programmatically defined and imported.

Afterwards, **seed** the programmatically defined values to the database by mapping each values/objects to a static model method `Model.create(value)`, which creates records in our table.

```javascript
const dbConn = require('.');//dbConn instead of just db to emphasize dbConn.sync() and dbConn.close()
const Products = require('./models/Products')

const products = [
  {name: 'things'}, 
  {name: 'stuff', status: 'discontinued'}, 
  {name: 'whatsits'}, 
  {name: 'dinguses'}, 
  {name: 'items', status: 'backorder'}];

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
```

## Query Database with Updated API Routes
Use read methods for the models/tables `Model.find___({where: {name: val}})`. This in SQL would be:
```sql
SELECT * FROM Model WHERE name = 'value';
```

Embedded in Javascript, we see `async/await`s:

```javascript
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
```

# Frontend Setup
In `src/client` include an `index.html` and `index.js` files.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>ACME Inventory</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

> [!NOTE] The `index.js` file is the **entry** point for Webpack and included in the `webpack.config.js` file. By default `index.js` is found directly under the `src` folder, not `src/client`.

## Update Webpack Entry with React Component
Update the `src/client/index.js`, which is Webpack's entry point, with the main React component, `src/client/components/App.js`.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

const root = document.getElementById('root');

ReactDOM.render(<App />, root);
```

## Build React App and Its Components

Import `react` and `axios` into the `App.js file`
