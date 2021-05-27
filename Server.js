const express = require('express');
const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt-nodejs');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const register = require('./Modules/Register');
const home = require('./Modules/Home');
const login = require('./Modules/Login');
const profile = require('./Modules/Profile');
const listings = require('./Modules/Listings');


const app = express();

app.use(cors());

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

const db = knex({
     client: 'pg',
     connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: {
		  rejectUnauthorized: false
		}
    //   host : '127.0.0.1',
    //   user : 'postgres',
    //   password : 'test',
    //   database : 'shop'
    }
});

const saltRounds = 10;

app.get('/', (req, res) =>{ home.handleHome(req, res, db) })

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt, saltRounds) })

app.post('/login', (req, res)=>{ login.handleLogin(req, res, db, bcrypt, saltRounds) })

app.post('/profile', cors(), (req, res) => { profile.handleProfile(req, res, db) })

app.put('/listings', cors(), (req, res) => { listings.handleListingsPut(req, res, db) })

app.delete('/listings', cors(), (req, res) => { listings.handleListingsDelete(req, res, db) })

console.log('10 4 dinosaur')
app.listen(process.env.PORT || 3000, () =>{
	console.log('app is running');
});