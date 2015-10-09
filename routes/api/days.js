var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var models = require('../../models');
var Day = models.Day;



//load one day
router.get('/:dayNum', function(req, res) {
	console.log('get request made with dayNum = ' + req.params.dayNum);
	res.send('hey you made a get request to day ' + req.params.dayNum)
})

//load all days
router.get('/', function(req,res) {
	console.log('get request made to load all days');
	Day.find()
		.populate('hotel restaurants activities')
	.then(function(data) {
		//console.log(data);
		res.json(data);
	}).then(null, function(err) {
		console.log(err);
	});
})

//deleting specific day
router.post('/delete/:dayNum', function(req, res) {
	console.log('start delete day')
	var dayNum = req.params.dayNum;
	Day.remove({number: dayNum})
	.then(function() {
		console.log('deleted day pt 1')
		return Day.update({number: {$gt: dayNum}},{$inc: {number: -1}}, {multi: true})
	}).then(function() {
		res.send();
	}).then(null, function(err) {
		console.log(err);
	})
	//console.log('delete request made with dayNum = ' + req.params.dayNum);
})

//save attraction - done
router.post('/:dayNum/:type', function(req, res, next) {
	console.log('post request made to save attraction');
	var id = mongoose.Types.ObjectId(req.body.id);
	//var id = req.body.id;
	console.dir(id);
	var type = req.params.type;
	var dayNum = req.params.dayNum;
	if(type === 'hotels') {
		Day.update({number: dayNum}, {hotel: id}).then(function () {
			res.send();
		});
	} else if (type === 'restaurants') {
		Day.update({number: dayNum}, {$push: {restaurants: id}}).then(function () {
			res.send();
		});
	} else if (type === 'activities') {
		Day.update({number: dayNum}, {$push: {activities: id}}).then(function () {
			res.send();
		});
	}

})

//create day - done
router.post('/:dayNum', function(req,res) {
	console.log('post request made to create day');
	var dayNum = req.params.dayNum;
	Day.findOne({number: dayNum}).then(function(day) {
		if(!day) 
			return Day.create({number: dayNum});
		else console.log("DAY - " + day);
	}).then(function() {
		res.send();
	}).then(null, function(err) {
		console.log(err);
	});
})

//delete attraction
router.post('/delete/:dayNum/:type', function(req,res) {
	console.log('post request made to delete attraction - ' + req.body.id);
	var type = req.params.type;
	var id = req.body.id;
	var dayNum = req.params.dayNum;
	if (type === 'hotels') {
		Day.update({number: dayNum}, {hotel: null})
		.then(function() {
			res.send();
		});
	} else if (type === 'restaurants') {
		Day.update({number: dayNum}, {$pull: {restaurants: id}})
		.then(function () {
			res.send();
		});
	} else if (type === 'activities') {
		Day.update({number: dayNum}, {$pull: {activities: id}})
		.then(function () {
			res.send();
		});
	}
})












module.exports = router;