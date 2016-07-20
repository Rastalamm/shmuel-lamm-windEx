// use npm geocoder to find coordinates
var NodeGeocoder = require('node-geocoder');
var options = {provider: 'google'};
var geocoder = NodeGeocoder(options);
var LatLon = require('geodesy').LatLonSpherical
var Promise = require("bluebird");
var data = []

var getCoordWithBluebird = (addresses) => {
  return new Promise(function(resolve, reject) {

    geocoder.geocode(addresses[0], function(err, res) {
      if (err) {reject(err)}
      else {
        formatData(0, res)
      }
    })
    geocoder.geocode(addresses[1], function(err, res) {
      if (err) {reject(err)}
      else {
        formatData(1, res)
        resolve(data)
      }
    })
  })
}

var runGeocoder = (start, finish, fn) => {
  getCoordWithBluebird([start, finish])
  .then(function(data) {
    let p1 = new LatLon(data[0].coordinates[0], data[0].coordinates[1])
    let p2 = new LatLon(data[1].coordinates[0], data[1].coordinates[1])
    // subtract 180 for future conversion to radians
    data[2] = {}
    data[2]["bearingForRadians"] = p1.bearingTo(p2) - 180
    data["midpoint"] = p1.midpointTo(p2);
    fn(null, data)
  })
  .catch(function(error) {
    console.log('Geocoder error through bluebird: ' + error)
  })
}

var formatData = function(num, res) {
  data[num] = {'coordinates': []}
  data[num]['address'] = res[0].formattedAddress
  data[num]['coordinates'][0] = res[0].latitude
  data[num]['coordinates'][1] = res[0].longitude
}

module.exports = runGeocoder
// runGeocoder('11 Broadway, New York', '350 5th Ave')
// return of function call above is:
// [ { coordinates: [ 40.7052799, -74.0140249 ],
//     address: '11 Broadway, New York, NY 10004, USA' },
//   { coordinates: [ 40.7484404, -73.9856554 ],
//     address: 'Empire State Building, 350 5th Ave, New York, NY 10118, USA' },
//   bearing: -153.5303246257672,
//   midpoint: LatLon { lat: 40.726861018183236, lon: -73.99984474975099 } ]
