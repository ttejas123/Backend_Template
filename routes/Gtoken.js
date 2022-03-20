const jwt = require('jsonwebtoken');
require('dotenv').config();

const gToken = (user) => {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRATE, { expiresIn: '30000s'})	
}

module.exports = gToken;