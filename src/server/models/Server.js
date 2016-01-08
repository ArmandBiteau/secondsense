'use strict';

var http = require('http');
var fs = require('fs');

class Server {

	constructor() {

		return http.createServer(function(req, res) {

            fs.readFile('./index.html', 'utf-8', function(error, content) {

                res.writeHead(200, {'Content-Type': 'text/html'});

                res.end(content);

            });

        });

	}

}

export default (new Server());
