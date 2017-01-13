const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT=8080; 

function handleRequest(request, response){
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

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
  console.log("Server listening on: http://localhost:%s", PORT);
});