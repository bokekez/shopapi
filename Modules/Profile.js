const handleProfile = (req, res, db) => {
    const item = req.body.item;
	const price = req.body.price;
	const username = req.body.username;
	const picture = req.body.picture;
	db.transaction(trx => {
		trx.insert({
			item: item,
			price: price,
			username: username,
			picture: picture
		})
		.into('items')
    	.returning('item')
		.then(item => {
				res.json(item[0]);
                console.log(item);
			    })
	    .then(trx.commit)
	    .catch(trx.rollback)
	})
    .catch(err => res.status(400).json('unable to create'));
}

module.exports = {
    handleProfile: handleProfile
};