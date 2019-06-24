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
### API Routes
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
>  "description": "practice with react, express, >and sequelize",
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

## Initialize Git