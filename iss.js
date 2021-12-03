const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) return console.log("It didn't work!" , error);
    //console.log(ip);
    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) return console.log("It didn't work!" , error);
      //console.log(coordinates);
      fetchISSFlyOverTimes(coordinates, (error, passTimes) => {
        if (error) return console.log("It didn't work!" , error);
        callback(null, passTimes);
      });
    });
  });
};
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  const request = require('request');
  let ipApi = `https://api.ipify.org?format=json`;
  request(ipApi, (error, response, body) => {
    if (error) return callback(error, null);
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const ip = JSON.parse(body).ip;
    // if we get here, all's well and we got the data
    callback(null, ip);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  const request = require('request');
  let geoApi = `https://api.freegeoip.app/json/${ip}?apikey=7a426860-53dd-11ec-ba3e-db1c602563f0`;
  request(geoApi, (error, response, body) => {
    if (error) return callback(error, null);
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const coordinates = {
      "latitude": JSON.parse(body).latitude,
      "longitude": JSON.parse(body).longitude
    };
    // if we get here, all's well and we got the data
    callback(null, coordinates);
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  const request = require('request');
  const lat = coords.latitude;
  const lon = coords.longitude;
  let issApi = `https://iss-pass.herokuapp.com/json/?lat=${lat}&lon=${lon}`;
  request(issApi, (error, response, body) => {
    if (error) return callback(error, null);
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching fly over info. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const flyOverInfo = JSON.parse(body).response;
    // if we get here, all's well and we got the data
    callback(null, flyOverInfo);
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation};