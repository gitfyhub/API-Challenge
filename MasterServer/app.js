const express = require('express');
const app = express();

app.get('/file_complete', function (req, res) {
  var id = req.query.id;
  console.log('filename: ' + id);
});

app.get('/worker_params', function (req, res) {
  var id = req.query.id;
  var amqp = require('amqplib/callback_api');
  amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      var queue = 'task_queue';
      var msg = process.argv.slice(2).join(' ') || id;
      channel.assertQueue(queue, {
        durable: true,
      });
      channel.sendToQueue(queue, Buffer.from(msg), {
        persistent: true,
      });
    });
  });
});

app.get('/', function (req, res) {
  res.send(
    'Welcome to the Master Server <br> http://localhost:3000/worker_params?id=yousmellnice <br> http://localhost:3000/file_complete?id=textfile.txt'
  );
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Master Server listening on localhost:' + port);
