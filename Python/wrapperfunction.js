var request = require('request');

callMasterServer('Call Master Server Sample text');

function callMasterServer(string_param) {
  request.get(
    'http://localhost:3000/worker_params?id=' + string_param,
    { json: { key: 'value' } },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
    }
  );
}
