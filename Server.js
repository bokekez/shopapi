const express = require('express');
const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const app = express();

app.use(cors())

// app.use((req, res, next) => {
// 	res.header('Access-Control-Allow-Origin', '*');
// 	next();
//   });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


const db = knex({
     client: 'pg',
     connection: {
    	// connectionString: process.env.DATABASE_URL,
		connectionString : process.env.DATABASE_URL,
    	ssl: true
      // host : 'postgresql-amorphous-40499',
      
    //   user : 'postgres',
    //   password : 'test',
    //   database : 'shop'
    }
});

app.get('/', cors(), (req, res) =>{
      db.select('id', 'item', 'price', 'sales').from('items')
      .then(data =>{
          res.json(data)
      })
})



app.post('/register', cors(), (req, res) => {
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	// const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			username: username,
			email: email,
      password: password
		})
		.into('users')
    .returning('username')
	// .returning('email')
		// .then(loginEmail =>{
    //   return trx('users')
    //   .returning('*')
    //       .insert({
    //       email: loginEmail[0],
    //       username: username,
		// 	    })
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

app.post('/login', cors(),(req, res)=>{
	db.select('email').from('users')
	.where('email', '=', req.body.email)
	.then(data => {
		const isValid = req.body.password;
		if (isValid){
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
	db.transaction(trx => {
		trx.insert({
			item: item,
			price: price
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
  .catch(err => res.status(400).json('unable to register'));

})

console.log('10 4 dinosaur')
app.listen(process.env.PORT || 3000, () =>{
	console.log('app is running');
});