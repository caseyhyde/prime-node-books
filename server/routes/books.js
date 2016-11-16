var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/sigma';
router.get('/', function(req, res) {
  console.log('get request');
  // get books from DB
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query('SELECT * FROM books', function(err, result) {
      done(); // close the connection.

      // console.log('the client!:', client);

      if(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      }
      res.send(result.rows);

    });

  });
});
router.post('/', function(req, res) {
  var newBook = req.body;
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }
    client.query(
      'INSERT INTO books (title, author, published, genre, edition, publisher) ' +
      'VALUES ($1, $2, $3, $4, $5, $6)',
      [newBook.title, newBook.author, newBook.published, newBook.genre, newBook.edition, newBook.publisher],
      function(err, result) {
        done();
        if(err) {
          console.log('insert query error: ', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });
  });
});
module.exports = router;
