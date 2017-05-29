const express = require('express');
const fs = require('fs');


const app = express();



app.use(express.static('.'))
/*app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});*/

app.get('/', function (req, res) {
	res.sendFile("./www/index.html") //, function (err, data) {
	/*res.writeHead(200, {
		'Content-Type': 'text/html'
	});*/
	//res.write(data);
	//res.end();
	//	});
});
app.get('/trial', function (req, res) {
	console.log("request");
	console.log(req.query);
	fs.readFile("data/users/users.json", function (err, data) {
		users = JSON.parse(data);
		console.log(users);
		username = req.query.uname;
		console.log(username)
		if (req.query.uname in users) {
			/*for (username in users) {
				console.log(username.password);
				console.log(username);
			}*/ // ------ Implement this
		}
	});

	//if (req.query) {
	res.send("hello");
	//}
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
//  res.status(404).sendFile("www/pages/error404.html")
//})
