# Welcome to WindEx!

Determine the impact of the wind on your next biking trip or flight.

## The Why

Bikers often use Google Maps to plan their biking trips, as it offers both directions and an estimated time enroute.
Google Maps does not, however, correct for the effects of wind on biking speed, which can significantly impact the length of a trip - sometimes nearly cutting it in half or doubling it.

Similarly, pilots at small airports often lack an automated way to calculate the headwind and crosswind components for their landings, which is critical for safe operations.

**WindEx solves both challenges.** After gathering data using geodesy, google's distance calculations, and weather data, WindEx calculates the direct headwind and crosswind components of the wind relative to average direction of travel. It then offers an updated time enroute estimate for bikers.

## Usage

*Click [here](http://wind-index.herokuapp.com/) to use the live site.*

Click [here](https://www.youtube.com/watch?v=tq7eBJldia8&feature=youtu.be) to view a video demo of the site.

To run this app locally, fork this repository and run:
```
$ npm install
$ node ./bin/www
```
Then navigate to http://localhost:3000/.
It's also necessary to get an api key from Google Distance Matrix API and OpenWeather API and set them respectively in google_distance.js and weather.js.

To use this site, simply enter your starting location and ending location. Then press 'Get Wind Adjustments'.
The locations you enter can include any address or landmark such as:
```
11 broadway, new york
empire state building
morristown, new jersey
Wurtsboro Airport
```

The app will then hit all the necessary apis, calculate the wind adjustments, and output the updated trip information!

## Build

This web app is built in Node.js and Express. It uses jQuery for page responsiveness.

## License

MIT ©
