const fs = require('fs');
const url = require('url');

// Set the following to false to disable basic HTTP
// authentication and ssl
const secure = true;
var PORT;
if (secure){
  const https = require('https');
  const auth = require('basic-auth');
  const certificates = require('./certificate.js').config;
  PORT=443;
}
else{
  const http = require('http');
  PORT=8080;
}

function passHash(password){
  const crypto = require('crypto');
  const hash = crypto.createHmac('sha256', "some_random_salt_value")
                   .update(password)
                   .digest('hex');
  return hash;
}

// TODO If this is deployed to a publicly accessible server
// then evaluate this once so we don't need to store the
// password in the source code.
const password = passHash("foo");
const username = 'HACS';

function handleRequest(request, response){
  if (secure){
    var credentials = auth(request);
    if (!credentials || credentials.name !== username || passHash(credentials.pass) !== password) {
      response.statusCode = 401;
      response.setHeader('WWW-Authenticate', 'Basic realm="Experiment"');
      response.end('Access denied');
      return;
    }
  }
  response.setHeader('Content-Type', 'text/html');
  if(request.url == "/"){
    response.end(fs.readFileSync("index.html", 'utf8'));
  }
  else if(request.url == "/jquery.js"){
    response.end(fs.readFileSync("jquery.js", 'utf8'));
  }
  else if(request.url.substr(0,11) == "/submit.php"){//JSON.stringify(
    var urlParts = url.parse(request.url, true);
    var query = urlParts.query;
    if(query.code !== undefined && query.data !== undefined && query.code == "d9923118dd0861486b3569ba080486a4"){
      var currentFile = fs.readFileSync("data/data.json", 'utf8');
      var jsonData = JSON.parse(currentFile);
      jsonData.push(JSON.parse(query.data));
      fs.writeFileSync("data/data.json", JSON.stringify(jsonData), 'utf8');
    }
    response.end();
  }
  else{
    response.statusCode = 404;
    response.end("Error Not Found");
  }
}

var protocol;
if (secure){
  var server = https.createServer(certificates, handleRequest);
  protocol = 'https';
}
else{
  var server = http.createServer(handleRequest);
  protocol = 'http';
}

server.listen(PORT, function(){
  console.log("Server listening on: %s://localhost:%s", protocol, PORT);
  if (secure){
    console.log("Password hash: %s", password);
  }
});