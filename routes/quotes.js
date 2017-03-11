var express = require('express');
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
});

/* GET users listing. */
router.get('/', function(req, res, timeLog) {
  res.send('respond with a resource');
});

router.post('/', function (req, res) {
  res.send('Got a POST request')
});

router.put('/quotes', function (req, res) {
  res.send('Got a PUT request at /user')
});

router.delete('/quotes', function (req, res) {
  res.send('Got a DELETE request at /user')
});

module.exports = router;
