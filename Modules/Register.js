const handleRegister = (req, res, db, bcrypt, saltRounds) => {
    const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	// const hash = bcrypt.hashSync(password);
	// let dbHash = '';
	bcrypt.hash(password, saltRounds, function(err, hash) {
		// returns hash
		// dbHash = hash;
		console.log(hash);
		// console.log('2', dbHash);
		db.transaction(trx => {
			trx.insert({
				username: username,
				email: email,
				password: hash
			})
			.into('users')
			.returning('username')
			.then(user => {
				res.json(user[0]);
			})
		  // })
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('unable to register'));
	})
}

module.exports = {
    handleRegister: handleRegister
};
  