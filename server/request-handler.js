/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var responses = {results: []};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept, X-Parse-Application-Id, X-Parse-REST-API-Key",
  "access-control-max-age": 10 // Seconds.
};


var requestHandler = function(request, response) {

  app.get('/classes/messages', function(){
    response.send('Hello World!');
  });
  app.post('/', function(){
    response.send('Got a POST request');
  });
  app.options('/', function(){
    response.send('meh');
  });



  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.

  var resultsObj = {};
  resultsObj.results = [];
  resultsObj.results.push(request);

  


  if(request.method === 'POST') {
    if(request._postData) {
      responses.results.push(request._postData);
    }
  }
  var statusCode;

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/plain";
  var urlTypes = ['/classes/messages', '/classes/room1', '/'];

  if(urlTypes.indexOf(request.url) === -1) {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end();
  } else if(request.method === 'POST') {
      statusCode = 201;
      response.writeHead(statusCode, headers);
      var data = '';
      request.on('data', function(chunk){
        data += chunk;
      });
      request.on('end', function(){
        var parsedData = JSON.parse(data);
        responses.results.push(parsedData);
        if(request.url === '/classes/messages') {
          response.end(JSON.stringify(responses));
        } else if (request.url === '/classes/room1') {
          response.end(JSON.stringify(responses));
        } 
      });
  } else if(request.method === 'GET') {
    statusCode = 200;
    response.writeHead(statusCode, headers);
    console.log(responses);
    response.end(JSON.stringify(responses));
  } else if(request.method === 'OPTIONS'){
    statusCode = 200;
    response.writeHead(statusCode, headers);
      if(request.url === '/'){
        response.writeHead(statusCode, headers);
        response.end(JSON.stringify(responses));
      } else if (request.url === '/classes/messages') {
        response.writeHead(statusCode, headers);
        response.end(JSON.stringify(responses));
      } else {
        response.end(JSON.stringify(responses));
      }
  }

  console.log("Serving request type " + request.method + " for url " + request.url);

  // The outgoing status.

  // See the note below about CORS headers.

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.



// exports.handleRequest = requestHandler;
exports.requestHandler  = requestHandler;

