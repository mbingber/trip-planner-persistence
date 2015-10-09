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
})

//save attraction - done
router.post('/:dayNum/:type', function(req, res, next) {
	//console.log('post request made to save');
	var id = mongoose.Types.ObjectId(req.body.id);
	//console.log('id is ' + id)
	var type = req.params.type;
	var dayNum = req.params.dayNum;
	if(type === 'hotel') {
		Day.update({number: dayNum}, {hotel: id}).then(null, next);
	} else if (type === 'restaurants') {
		Day.update({number: dayNum}, {$push: {restaurants: id}}).then(null, next);
	} else if (type === 'activities') {
		Day.update({number: dayNum}, {$push: {activities: id}}).then(null, next);
	}

})

//create day - done
router.post('/:dayNum', function(req,res) {
	//console.log('post request made to create day');
	var dayNum = req.params.dayNum;
	Day.findOne({number: dayNum}).then(function(day) {
		if(!day) return Day.create({number: dayNum});
	}).then(null, function(err) {
		console.log(err);
	});
})

//delete attraction
router.delete('/:dayNum/:type', function(req,res) {
	console.log('post request made to delete attraction');
	res.send('deleting day: ' + req.params.dayNum + ' ' + req.params.type)
})

//deleting specific day
router.delete('/:dayNum', function(req, res) {
	console.log('delete request made with dayNum = ' + req.params.dayNum);
})

module.exports = router;