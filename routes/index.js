var getIp = require('external-ip')();
var request = require('request');
var express = require('express');
var router = express.Router();

var config = require('../config.js');
var DB =require('../javascripts/db');

var publicIP;

getIp(function(err, ip) {
  if(err) {
    console.log("Failed to retrive IP address: " + err.message);
    throw err;
  } else {
    console.log("Mea2n API running on " + ip + ":" + config.expressPort);
    publicIP = ip;
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  var testObject = {
    "AppName": "Mea2n",
    "Version": 1.0
  }
  res.json(testObject);
});

router.get('/ip', function(req, res, next) {
  res.json({"ip": publicIP});
});

router.get('/config', function(req, res, next) {
  res.json(config.client);
});

router.post('/sampleDocs', function(req, res, next) {
  
  var requestBody = req.body;
  var database = new DB;

  database.connect(requestBody.MongoDBURI)
    .then(
      function() {
        return database.sampleCollection(
          requestBody.collectionName,
          requestBody.numberDocs)
      })
    .then(
      function(docs) {
        return {
            "success": true,
            "documents": docs,
            "error": ""
        };
      },
      function(error) {
        console.log("Failed to retrive sample data: " + error);
        return {
            "success": false,
            "documents": null,
            "error": "Failed to retrive sample data: " + error
        };
      })
    .then(
      function(resultObject) {
        database.close();
        res.json(resultObject);
      }
    )
    /* test this route

        curl -g -X POST --data '{
        "MongoDBURI": "mongodb://localhost:27017/mea2n?authSource=admin&socketTimeoutMS=30000&maxPoolSize=20",
          "collectionName": "restaurants",
          "numberDocs": "2"
        }' "localhost:3000/sampleDocs" --header "Content-Type:application/json" | python -mjson.tool
    */

});

module.exports = router;


