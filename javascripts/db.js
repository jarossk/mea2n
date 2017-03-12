var MongoClient = require(mongodb).MongoClient;

function DB() {
  this.db = null;
}

DB.prototype.connect = function(uri) {
  
  var _this = this;

  return new Promise(function(resolve, rejcet) {
    if(_this.db) {
      resolve();
    } else {
      var __this = _this;
      MongoClient.connect(uri)
        .then(
            function(database) {
              __this.db = database;
              resolve();
            },
            function(err) {
              console.log("Error conncetion: " + err.message);
              reject(err.message);
            }
        )
    }
  });
}

DB.prototype.close = function() {
  
  if(this.db) {
    this.db.close()
    .then(
      function() {},
      function(error) {
        console.log("Failed to close database: " + errro.message);
      }
    )
  }
}

DB.prototype.sampleCollection = function(coll, numberDocs) {

  var _this = this;

  return new Promise(function(resolve, reject) {
    _this.db.collection(coll, {strict: true}, function(error, collection) {
      if(error) {
        console.log("Could not access collection: " + error.message);
        reject(error.message);
      } else {
        // Create a cursor from the aggregation request
        var cursor = collection.aggregate([
          {
            $sample: {size: parseInt(numberDocs)} 
          }],
          { cursor: { batchSize: 10} }
        )

        // Interate over the cursor to access each document in the sample 
        // result set. Could use cursor.each() if we wanted to work with
        // individual documents here.

        cursor.toArray(function(error, docArray) {
          if(error) {
            console.log("Error reading from cursor: " + error.message);
            reject(error.message);
          } else { 
            reslove(docArray);
          }
        });
      }
    });
  });
}

module.exports = DB;
