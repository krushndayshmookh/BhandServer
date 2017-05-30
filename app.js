const express = require('express');
const fs = require('fs');
var config = require('./config');


const app = express();



//app.use(express.static('www'))
//app.use('/data', express.static('data'))
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/', function (req, res) {
	res.sendFile("www/index.html") //, function (err, data) {
	/*res.writeHead(200, {
		'Content-Type': 'text/html'
	});*/
	//res.write(data);
	//res.end();
	//	});
});
app.get('/login', function (req, res) {
	//console.log("request");
	//console.log(req.query);
	username = req.query.uname;
	//console.log(username);
	password = req.query.pword;
	fs.readFile("data/users/users.json", function (err, data) {
		users = JSON.parse(data);

		//console.log(users);
		//console.log(JSON.parse(data));
		//console.log(username)
		if (username in users) {
			//;
			if (users[username].password == password) {
				res.send("true");
				//console.log(users[username].password);
				console.log(username + " logged in.");
			} else {
				res.send("false");
				console.log(username + " entered incorrect password.");
			}

		} else {
			res.send("invalid");
			console.log(username + " does not exist.");
		}

	});


});

/*app.get('/apk', function (req, res) {
	console.log("requested for app");
	res.sendFile("/files/BA.apk");
	console.log("app sent")
});*/
app.listen(3000, function () {
	console.log('App listening on port 3000!');
});







// must be at last
//app.use(function (req, res, next) {
// res.status(404).sendFile("www/pages/error404.html")
//})
