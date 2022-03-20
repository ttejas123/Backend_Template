const express = require('express')
const router  = express.Router()
const user = require('../model/user')
const fs = require('fs')
const path = require('path')
const csvUpload = require('./csvUpload')
const csv=require('csvtojson')
const insertManyDJ = require('./insertMany')
const getImgById = require('./getById')
const verifyAuth = require('./authentication');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const GToken = require('./Gtoken');

//Delete One 6
router.delete('/:id', getImgById(user, ''), async (req, res) => {
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

//delete Many
router.post('/deleteManyById', async (req, res) => {
	const id = req.body.deleteManyById
	try {
		const manyDelete = await user.deleteMany({
														    "_id": {
														        "$in": id
														        }
														 }) 
		res.status(201).json(manyDelete)
	} catch (e) {
		res.status(500).json({message: e.message})
	}
})

//Get One
router.get('/:id', getImgById(user, ''), async (req, res) => {
	res.json(res.subscriber)
})

//upload.single('csvFile'), 
router.post('/csvFile', csvUpload.single('csvFile'), async (req, res) => {
	const pathChange = __dirname
	const PathOfCsv = pathChange.toString().replace('routes','') + 'upload\\csv\\' + req.file.filename
	//console.log(PathOfCsv)
	csv()
	.fromFile(PathOfCsv)
	.then( async (jsonObj)=>{
	   console.log(jsonObj)
	   const Check = await insertManyDJ(req, res, jsonObj, user) 
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

//read all
router.get('/', async (req, res) => {
	try{
		const dataUser = await user.find().limit(100)
		//console.log(dataUser)
		let i = 0
		let arr = []
		//const dataUser = await dataUsercriber.find().limit(1).skip(1)
		while(i < dataUser.length) {
			const dd = "" + dataUser[i]._id + ""
			arr.push(dd)
			i++
		}
		let dataSend = JSON.stringify({deleteManyById: arr}, null, 2) 
		fs.writeFile('deleteId.json', dataSend, finished)
		function finished(err) {
			console.log('all set.')
		}
		res.status(202).json({data: dataUser})

	}catch(e){
		res.status(404).json({msg: e.message})
	}
})

//find /search
router.post('/find', async (req, res) => {
	try{
		const find = await user.find({$text: {$search: req.body.find}})
		//const find = await user.find({$text: {$search: req.body.find}})
		if(find.length == 0){
			const subscriber =  user.find({$or: [{ username: { $regex: req.body.find, $options: "i" } }]}).then((val, index) => {
					if (val.length === 0) {
						return res.status(404).json({message: "Can't find user"})
					} else {
						return res.status(201).json({data: val})
					}
				})
		}else{
			res.status(202).json({data: find})
		}
	}catch(e){
		res.status(404).json({message: e.message})
	}
})

//create One
router.post('/', async (req, res)=> {
	try{
		//console.log(req.body)
		const newuser = new user(req.body)
		const newSubscriber = await newuser.save();
		res.status(201).json({data: newSubscriber})
	} catch (e) {
		res.status(404).json({message: e.message})
	}

})

module.exports= router