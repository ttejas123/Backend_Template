//get all info of specific doc by ID Middalware
function getImgById(storedvalue, userss) {
  return async function(req, res, next) {
  	let subscriber
	try {
		let getFullData
		subscriber = await storedvalue.findById(req.params.id)
							.populate(`${userss}`) // only works if we pushed refs to person.eventsAttended
							.exec(function(err, person) {
							    
							    res.subscriber = person
							    next()
							})

		// if (subscriber == null) {
		// 	return res.status(404).json({message: "Can't find subscriber"})
		// }
	} catch (e) {
		return res.status(500).json({message: e.message})
	}
  }
}

module.exports = getImgById;