const handleLogin = (req, res, db, bcrypt, saltRounds) => {
    db.select('email', 'password').from('users')
	.where('email', '=', req.body.email)
	.then(data => {
		const tempPw = req.body.password;
		const tempHash = data[0].password;
		console.log(tempHash)
		// let valid = false;
		// const tempHash = data[0].password;
		// console.log(tempHash);
		// bcrypt.compare(tempPw, tempHash, function(err, result) {
		// 	if(result){
		// 		valid = true;
		// 	}
		// });	
		const isValid = bcrypt.compareSync(tempPw, tempHash);
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
}

module.exports = {
    handleLogin: handleLogin
};
      