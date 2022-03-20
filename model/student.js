const mongoose = require('mongoose')
//const slug = require('mongoose-slug-generator');
const schemaToLoad = mongoose.Schema
//console.log(schemaToLoad);
const student = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	age: {
		type: String,
		required: true
	},
	school: {
		type: String,
		required: true
	},
	class: {
	    type: String
	},
	user: {
		type: schemaToLoad.Types.ObjectId,
		ref: 'user'
	},
	status: {
	    type: String
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		required: true,
		default: Date.now
	}
})
student.index({name: 'text', school: 'text'});
// subInfoSchema.plugin(slug, { tmpl: '<%=name%>' });
module.exports = mongoose.model('student', student)