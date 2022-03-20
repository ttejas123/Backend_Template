const express = require('express')
const router  = express.Router()
//const multer = require('multer')
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const student = require('../model/student')
//const fileUpload = require('./fileUpload')
const csvUpload = require('./csvUpload')
const csv=require('csvtojson')
const insertManyDJ = require('./insertMany')
const getImgById = require('./getById')
const verifyAuth = require('./authentication');

const postIHave = [
	{
		username: "tejas123j",
		data: "Hello There"
	},
	{
		username: "tejas123",
		data: "second user"
	}
]
//verify and post
router.post('/userData', verifyAuth, async (req, res, next) => {
	//"617d8236b2800b7f4bd70f04"
	console.log(req.user)
	const studentData = await student.find({"user": req.user.id}).limit(100)
						.populate('user') // only works if we pushed refs to submg
						.exec(function(err, person) { 
							console.log(person)
							res.status(201).json({
								data: person
							})
							next()
						})
})

//Get ALL
router.get('/', async (req, res) => {

	try {
		student.find().limit(100)
						.populate('user') // only works if we pushed refs to submg
						.exec(function(err, person) { 
							console.log(person)
							res.status(201).json({
								//data: arr 

								data: person
							})
							//res.subscriber = person
							//next()
						})
		let i = 0
		let arr = []
		const subs = await student.find().limit(100)

		//const subs = await Subscriber.find().limit(1).skip(1)
		while(i < subs.length) {
			const dd = "" + subs[i]._id + ""
			arr.push(dd)
			i++
		}
		let dataSend = JSON.stringify({deleteManyById: arr}, null, 2) 
		fs.writeFile('deleteId.json', dataSend, finished)
		function finished(err) {
			console.log('all set.')
		}
	} catch (e) {
		res.status(500).json({message: e.message})
	}
})

//Get One 2
router.get('/:id', getImgById(student, 'user'), async (req, res) => {
	res.json(res.subscriber)
})

//Create One 
router.post('/', async (req, res)=> {
	try{
		//console.log(req.body)
		const newStudent = new student(req.body)
		const newSubscriber = await newStudent.save();
		res.status(201).json({msg: newSubscriber})
	} catch (e) {
		res.status(404).json({message: e.message})
	}

})

//Create Many 4
router.post('/multi', async (req, res) => {
	try {

		const newSubscriber = await student.insertMany(req.body.multi)
		res.status(201).json(newSubscriber)
	} catch (e) {
		res.status(500).json({message: e.message})
	}
})

//delete Many
router.post('/deleteManyById', async (req, res) => {
	const id = req.body.deleteManyById
	try {
		const manyDelete = await student.deleteMany({
														    "_id": {
														        "$in": id
														        }
														 }) 
		res.status(201).json(manyDelete)
	} catch (e) {
		res.status(500).json({message: e.message})
	}
})

//upload.single('csvFile'), 
router.post('/csvFile', csvUpload.single('csvFile'), async (req, res) => {
	const pathChange = __dirname
	const PathOfCsv = pathChange.toString().replace('routes','') + 'upload\\csv\\' + req.file.filename
	//console.log(PathOfCsv)
	csv()
	.fromFile(PathOfCsv)
	.then( async (jsonObj)=>{
	   //console.log(jsonObj)
	   const Check = await insertManyDJ(req, res, jsonObj, student) 
	   if(Check) {
	   	fs.unlink(PathOfCsv, (err) => {
	   		  if (err) {
	   		  	console.log(err);
			 } else {
			    console.log(`\nDeleted file: ${req.file.filename}`);
			  }
	   	})
	   	res.status(201).json({inseredData: Check})
	   }else {
	   	res.status(500).json({message: "UnScessful"})
	   }
	})
})

//find by channel and name (Search) 8 fully completed
router.post('/find', async (req, res) => {
	try {
			const subscriber = await student.find({$text: { $search: req.body.find }})	
			if (subscriber.length == 0) {
				const subscriber =  student.find({$or: [{ name: { $regex: req.body.find, $options: "i" } }, { school: { $regex: req.body.find, $options: "i" } }]}).then((val, index) => {
					if (val.length === 0) {
						return res.status(404).json({message: "Can't find student"})
					} else {
						return res.status(201).json({data: val})
					}
				})
			} else {
				  res.status(201).json({data: subscriber})
			}
	} catch (e) {
		 res.status(500).json({message: e.message})
	}
})

//Delete One 6
router.delete('/:id', getImgById(student, ''), async (req, res) => {
	try {
		const DeletedSubscriber = await res.subscriber.remove()
		res.json({
			message: "Deleted Subscriber",
			data: DeletedSubscriber
		})
	} catch (e) {
		res.status(404).json({message: "Id Not Found"})
	}
})
module.exports= router