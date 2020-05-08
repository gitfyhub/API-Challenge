var amqp = require('amqplib/callback_api');
var request = require('request');
var fs = require('fs');
var randomstring = require('randomstring');

amqp.connect('amqp://localhost', function (error, connection) {
  connection.createChannel(function (error, channel) {
    var queue = 'task_queue';
    channel.assertQueue(queue, {
      durable: true,
    });
    channel.prefetch(1);
    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);
    channel.consume(
      queue,
      function (msg) {
        var secs = msg.content.toString().split('.').length - 1;
        console.log(' [x] Received: %s', msg.content.toString());
        fileCreator(msg.content.toString());
        setTimeout(function () {
          console.log(' [x] Done');
          channel.ack(msg);
        }, secs * 1000);
      },
      {
        noAck: false,
      }
    );
  });
});

function fileCreator(msg) {
  console.log('File Creator function');
  console.log(msg);
  filename = randomstring.generate(7) + '.txt';
  fs.writeFile(filename, msg, function (err) {
    if (err) throw err;
  });
  request.get(
    'http://localhost:3000/file_complete?id=' + filename,
    { json: { key: 'value' } },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
    }
  );
}
