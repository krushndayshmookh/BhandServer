const express = require('express');
const fs = require('fs');


const app = express();






app.get('/', function (req, res) {
	fs.readFile("index.html", function (err, data) {
		/*res.writeHead(200, {
			'Content-Type': 'text/html'
		});*/
		res.write(data);
		res.end();
	});
});



app.listen(3000, function () {
	console.log('App listening on port 3000!');
});
