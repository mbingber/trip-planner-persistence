'use strict';
/* global $ mapModule */

var daysModule = (function(){

  var exports = {},
      days = [{
        hotels:      [],
        restaurants: [],
        activities:  []
      }],
      currentDay = days[0];

  function loadDays(data) {
    console.dir(data);

    data.forEach(function(day) {
      if (day.hotel) day.hotel.type = 'hotels';
      day.restaurants.forEach(function(rest) {
        rest.type = 'restaurants';
      });
      day.activities.forEach(function(act) {
        act.type = 'activities';
      })
      var dayObj = {};
      dayObj.hotels = [];
      if (day.hotel) dayObj.hotels = [day.hotel] ;
      dayObj.restaurants = day.restaurants;
      dayObj.activities = day.activities;
      days[day.number-1] = dayObj;
    })

    console.dir(days);
    postForDay(1);
    switchDay(0);
  }

  function postForDay(dayNum) {
    $.post('/api/days/' + dayNum, function(data) {
      console.log('added day' + dayNum);
    }).fail(function(err) {
      console.log('err', err);
    })
  }

  function addDay () {
    postForDay(days.length + 1);
    days.push({
      hotels: [],
      restaurants: [],
      activities: []
    });
    renderDayButtons();
    switchDay(days.length - 1);
  }

  function switchDay (index) {
    var $title = $('#day-title');
    if (index >= days.length) index = days.length - 1;
    $title.children('span').remove();
    $title.prepend('<span>Day ' + (index + 1) + '</span>');
    currentDay = days[index];
    renderDay();
    renderDayButtons();
  }

  function removeCurrentDay () {
    if (days.length === 1) return;
    var dayNum = $('.current-day').text();
    console.log('in removeCurrentDay');
    $.post('/api/days/delete/' + dayNum, 
      function(data) {
        console.log('deleted day!');
      }).fail(function(err) {
        console.log('err', err);
    });
    var index = days.indexOf(currentDay);
    days.splice(index, 1);
    switchDay(index);
  }

  function renderDayButtons () {
    var $daySelect = $('#day-select');
    $daySelect.empty();
    days.forEach(function(day, i){
      $daySelect.append(daySelectHTML(day, i, day === currentDay));
    });
    $daySelect.append('<button class="btn btn-circle day-btn new-day-btn">+</button>');
  }

  function daySelectHTML (day, i, isCurrentDay) {
    return '<button class="btn btn-circle day-btn' + (isCurrentDay ? ' current-day' : '') + '">' + (i + 1) + '</button>';
  }

  exports.addAttraction = function(attraction) {
    if (currentDay[attraction.type].indexOf(attraction) !== -1) return;
    if (attraction.type === 'hotels') currentDay[attraction.type][0] = attraction;
      else currentDay[attraction.type].push(attraction);
    console.log(attraction._id);
    var dayNum = $('.current-day').text();
    $.post('/api/days/' + dayNum + '/' + attraction.type, {id: attraction._id}, 
      function(data) {
        console.log('added attraction!');
      }).fail(function(err) {
      console.log('err', err);
    });
    renderDay(currentDay);
  };

  exports.removeAttraction = function (attraction) {
    console.dir(currentDay);
    console.dir(attraction);
    console.log(attraction.type)
    var id = attraction._id;
    var index = -1;
    currentDay[attraction.type].forEach(function(attraction, i) {
      if (attraction._id === id) index = i;
    });
    console.log('index - ', index);
    if (index === -1) return;
    var dayNum = $('.current-day').text();
    $.post('/api/days/delete/' + dayNum + '/' + attraction.type, {id: attraction._id}, 
      function(data) {
        console.log('deleted attraction!');
      }).fail(function(err) {
      console.log('err', err);
    });
    currentDay[attraction.type].splice(index, 1);
    renderDay(currentDay);
  };

  function renderDay(day) {
    mapModule.eraseMarkers();
    day = day || currentDay;
    Object.keys(day).forEach(function(type){
      var $list = $('#itinerary ul[data-type="' + type + '"]');
      $list.empty();
      day[type].forEach(function(attraction){
        $list.append(itineraryHTML(attraction));
        var toLog = mapModule.drawAttraction(attraction);
        console.log(toLog);
      });
    });
  }

  function itineraryHTML (attraction) {
    return '<div class="itinerary-item><span class="title>' + attraction.name + '</span><button data-id="' + attraction._id + '" data-type="' + attraction.type + '" class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
  }

  $(document).ready(function(){
    $.get('/api/days/', loadDays)
    .fail(function(err) {
      console.log('err', err);
    });
    
    $('.day-buttons').on('click', '.new-day-btn', addDay);
    $('.day-buttons').on('click', 'button:not(.new-day-btn)', function() {
      switchDay($(this).index());
    });
    $('#day-title').on('click', '.remove', removeCurrentDay);
  });

  return exports;

}());
