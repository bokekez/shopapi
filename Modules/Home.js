const handleHome = (req, res, db) => {
    db.select('id', 'item', 'price', 'username', 'sales', 'picture').from('items')
        .then(data =>{
        res.json(data)
		console.log(data);
    })
}

module.exports = {
    handleHome: handleHome
};
      