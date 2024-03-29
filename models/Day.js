var mongoose = require('mongoose');
var HotelSchema = require('./hotel').schema;
var RestaurantSchema = require('./restaurant').schema;
var ActivitySchema = require('./activity').schema;

var DaySchema = new mongoose.Schema({
	number: {type: Number, required: true},
	hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel'},
	//restaurants: [{restaurant: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'}}],
	restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'}],
	activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity'}]
});

module.exports = mongoose.model('Day', DaySchema);