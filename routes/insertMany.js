//insert multi data
async function dataToinsert(req, res, jsonObj, datato) {
	let subscriber
	try {
		//console.log(jsonObj)
		subscriber = await datato.insertMany(jsonObj)
		if (subscriber == null) {
			return res.status(404).json({message: subscriber})
		}
	} catch (e) {
		return res.status(500).json({message: e.message})
	}
	return subscriber
	next()
}

module.exports = dataToinsert;