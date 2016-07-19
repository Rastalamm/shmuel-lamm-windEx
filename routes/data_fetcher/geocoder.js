// use npm geocoder to find coordinates
var NodeGeocoder = require('node-geocoder');
var options = {provider: 'google'};
var geocoder = NodeGeocoder(options);
var geolib = require('geolib')
var Promise = require("bluebird");
var data = []

var formatData = function(num, res) {
  data[num] = {'coordinates': {}}
  data[num]['address'] = res[0].formattedAddress
  data[num]['coordinates']['latitude'] = res[0].latitude
  data[num]['coordinates']['longitude'] = res[0].longitude
}

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

var runGeocoder = (start, finish) => {
  getCoordWithBluebird([start, finish])
  .then(function(data) {
    data["midpoint"] = geolib.getCenter([
      data[0].coordinates,
      data[1].coordinates
    ]);
    console.log(data)
  })
  .catch(function(error) {
    console.log('Geocoder error through bluebird:' + error)
  })
}

runGeocoder('29 Av. des Champs-Élysées', '350 5th Ave')

// return of is:
// [ { coordinates: { latitude: 48.869384, longitude: 2.3071868 },
//     address: '29 Av. des Champs-Élysées, 75008 Paris, France' },
//   { coordinates: { latitude: 40.7484404, longitude: -73.9856554 },
//     address: 'Empire State Building, 350 5th Ave, New York, NY 10118, USA' },
//   midpoint: { latitude: '51.588701', longitude: '-39.009241' } ]
