const Sequelize = require('sequelize');
const password = require('./pass');

//Create Postgres DB in Terminal with: `createdb.exe -U postgres inventory`
//const db = new Sequelize(process.env.DATABASE_URL || 'postgres://[username:password@]localhost[:post]/dbName')
// const db = new Sequelize (dbName, username, password, {options})
const db = new Sequelize('inventory', 'postgres', password, {
  dialect: 'postgres',
  host: process.env.HOST||'localhost',
  port: process.env.DB_PORT||5432,
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
