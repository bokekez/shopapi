const express = require('express');
const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt-nodejs');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

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
		// connectionString : process.env.DATABASE_URL,
    	// ssl: true
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

app.get('/', (req, res) =>{
      db.select('id', 'item', 'price', 'sales', 'username').from('items')
      .then(data =>{
          res.json(data)
		  console.log(data);
      })
})

app.post('/register', (req, res) => {
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	// const hash = bcrypt.hashSync(password);
	let dbHash = '';
	bcrypt.hash(password, saltRounds, function(err, hash) {
		// returns hash
		dbHash = hash;
		console.log(hash);
		console.log('2', dbHash);
	});
	db.transaction(trx => {
		trx.insert({
			username: username,
			email: email,
      		password: dbHash
		})
		.into('users')
    	.returning('username')
	// .returning('email')
	// 	 .then(loginEmail =>{
    //   return trx('users')
    //   .returning('*')
    //       .insert({
    //       email: loginEmail[0],
    //       username: username,
	// 		    })
		.then(user => {
          console.log(user);
				res.json(user[0]);
          console.log(user);
			})
		// })
	  .then(trx.commit)
	  .catch(trx.rollback)
	})
  .catch(err => res.status(400).json('unable to register'));

})

app.post('/login', (req, res)=>{
	db.select('email').from('users')
	.where('email', '=', req.body.email)
	.then(data => {
		const tempPw = req.body.password;
		let valid = false;
		const hash = db.select('password').from('users')
		bcrypt.compare(tempPw, hash, function(err, result) {
			if(result){
				valid = true;
			}
		});	
		if (valid){
			return 	db.select('*').from('users')
			.where('email', '=', req.body.email)
			.then(user => {
				console.log(user);
				res.json(user[0])
			})
			.catch(err => res.status(400).json('Unable to get user'))
		} else {
			res.status(400).json('Wrong credentials')
		}
	})
})

app.post('/profile', cors(), (req, res) => {
	const item = req.body.item;
	const price = req.body.price;
	const username = req.body.username;
	db.transaction(trx => {
		trx.insert({
			item: item,
			price: price,
			username: username
		})
		.into('items')
    	.returning('item')
		.then(item => {
          console.log(item);
				  res.json(item[0]);
          console.log(item);
			    })
	  .then(trx.commit)
	  .catch(trx.rollback)
	})
  .catch(err => res.status(400).json('unable to create'));

})

console.log('10 4 dinosaur')
app.listen(process.env.PORT || 3000, () =>{
	console.log('app is running');
});