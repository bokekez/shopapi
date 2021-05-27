const handleListingsPut= (req, res, db) => {
    const item = req.body.item;
	const price = req.body.price;
	const username = req.body.username;
	const id = req.body.id;
	const picture = req.body.picture;
	db.transaction(trx => {
		if(picture != ""){
		trx.update({
			item: item,
			price: price,
			sales: 0,
			picture: picture
		})
		.where({id : req.body.id})
		.into('items')
    	.returning('item')
		.then(item => {
          console.log(item);
		  console.log(id)
				  res.json(item[0]);
          console.log(item);
			    })
		.then(trx.commit)
		.catch(trx.rollback)
		}
		if(picture == ""){
			trx.update({
				item: item,
				price: price,
			})
			.where({id : req.body.id})
			.into('items')
			.returning('item')
			.then(item => {
			  console.log(item);
			  console.log(id)
					  res.json(item[0]);
			  console.log(item);
					})
			.then(trx.commit)
			.catch(trx.rollback)
		}
	})
    .catch(err => res.status(400).json('unable to update'));
}

const handleListingsDelete= (req, res, db) => {
    const id = req.body.id;
	db.transaction(trx => {
		trx.del()
		.where({id : req.body.id})
		.into('items')
    	.returning('item')
		.then(item => {
          console.log(item);
		  console.log(id)
				  res.json(item[0]);
          console.log(item);
			    })
	  .then(trx.commit)
	  .catch(trx.rollback)
	})
    .catch(err => res.status(400).json('unable to update'));
}


module.exports = {
    handleListingsPut: handleListingsPut,
    handleListingsDelete: handleListingsDelete
};