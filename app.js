//==============================================================================

/* 
 * Author: Krushn Dayshmookh
 *
 */









/****************************
 *                          *
 *   GLOBAL DECLARATIONS    ****************************************************
 *                          *
 ****************************
 */


const express = require('express');
const fs = require('fs');

var config = require('./config');


//var usermanager = require('./scripts/usermanager');


var ipaddress = config.ipaddress;
var appport = config.appport;
var dataport = config.dataport;
var paperport = config.paperport;





/****************************
 *                          *
 *         APP DATA         ****************************************************
 *                          *
 ****************************


 * This part is used for serving the app data which will be accessible througn the app.
 * Ex:
 *     User information, academics
 *     Requests for canteen order
 *
 */


const app = express();



//app.use(express.static('www'))
//app.use('/data', express.static('data'))
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/', function (req, res) {
	fs.readFile("www/index.html", function (err, data) {
		/*res.writeHead(200, {
			'Content-Type': 'text/html'
		});*/
		res.write(data);
		res.end();
	});
});


app.get('/login', function (req, res) {
	//console.log("request");
	//console.log(req.query);
	var username = req.query.uname;
	//console.log(username);
	var password = req.query.pword;


	fs.readFile("data/users/users.json", function (err, data) {
		var users = JSON.parse(data);

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




app.get('/userdata', function (req, res) {
	//console.log("request");
	//console.log(req.query);
	var username = req.query.username;
	//console.log(username);

	fs.readFile(config.userlist, function (err0, userdata) {
		var users = JSON.parse(userdata);

		//console.log(users);
		//console.log(JSON.parse(data));
		//console.log(username);
		//console.log(users[username].type);
		if (username in users) {
			//console.log(users[username].type);
			var userpath = "data/users/" + users[username].type + "/" + username + "/";
			//console.log(userpath);
			var profilepath = userpath + "profile.json";
			//console.log(profilepath);
			fs.readFile(profilepath, function (err1, profiledata) {
				//console.log(profiledata);

				var profile = JSON.parse(profiledata);

				//console.log(profile);
				res.send(profile);
				console.log("Profile of " + username + " sent.");




				/*fs.readFile(userpath+"user.png",function(err2,imgdata){
					profile["user-img"] = imgdata;
					//console.log(profile["user-img"]);


				});*/
			});

		}
	});

});

app.get('/username-name', function (req, res) {
	//console.log("request");
	//console.log(req.query);
	var username = req.query.user;
	//console.log(username);
	fs.readFile("data/users/users.json", function (err0, userdata) {
		var users = JSON.parse(userdata);
		//console.log(users);
		//console.log(JSON.parse(data));
		//console.log(username);
		//console.log(users[username].type);
		if (username in users) {
			//console.log(users[username].type);
			var userpath = "data/users/" + users[username].type + "/" + username + "/";
			//console.log(userpath);
			var profilepath = userpath + "profile.json";
			//console.log(profilepath);
			fs.readFile(profilepath, function (err1, profiledata) {
				//console.log(profiledata);
				var profile = JSON.parse(profiledata);
				//console.log(profile);
				res.send(profile.Name);
				console.log("Name of " + username + " sent.");
			});
		}
	});

});




app.get('/notifications', function (req, res) {
	var type = req.query.type;
	//  type can be "departmantal" or "general"


	//console.log(type);
	fs.readFile("data/notifications/" + type + ".json", function (err0, notificationdata) {
		var notifications = JSON.parse(notificationdata);
		//console.log(notifications);
		res.send(notifications);
		console.log(type + " notifications sent.");
	});

});





app.get('/attendance', function (req, res) {
	var username = req.query.username;
	//  type can be "departmantal" or "general"
	fs.readFile("data/users/users.json", function (err0, userdata) {
		var users = JSON.parse(userdata);
		//console.log(type);
		var userpath = "data/users/" + users[username].type + "/" + username + "/";
		//console.log(userpath);
		var attendancepath = userpath + "attendance.json";
		//console.log(profilepath);
		fs.readFile(attendancepath, function (err1, attendancedata) {
			//console.log(profiledata);

			var attendance = JSON.parse(attendancedata);

			//console.log(profile);
			res.send(attendance);
			console.log("Attendance of " + username + " sent.");


		});
	});

});

app.get('/academics', function (req, res) {
	var username = req.query.username;
	//  type can be "departmantal" or "general"
	fs.readFile("data/users/users.json", function (err0, userdata) {
		var users = JSON.parse(userdata);
		//console.log(type);
		var userpath = "data/users/" + users[username].type + "/" + username + "/";
		//console.log(userpath);
		var academicspath = userpath + "academics.json";
		//console.log(profilepath);
		fs.readFile(academicspath, function (err1, academicsdata) {
			//console.log(profiledata);

			var academics = JSON.parse(academicsdata);

			//console.log(profile);
			res.send(academics);
			console.log("Academics of " + username + " sent.");


		});

	});
});








/*app.get('/apk', function (req, res) {
	console.log("requested for app");
	res.sendFile("/files/BA.apk");
	console.log("app sent")
});*/



app.listen(appport,ipaddress, function () {
	console.log('App listening on port 3000 on '+ipaddress+' !');
});







// must be at last
app.use(function (req, res, next) {
	fs.readFile("www/index.html", function (err, data) {
		res.status(404).write(data);
		res.end();
	});
});









/****************************
 *                          *
 *       DATA-SERVER        ****************************************************
 *                          *
 ****************************


 * This part is used for serving the admin pages which will not be accessible througn the app.
 * Ex:
 *     Canteen Order listings
 *     User addition for the manager
 *     Other priviledged accounts
 *
 * This part merged in app.js as it will  be easier to run two ports in same process in dataServer like openshift http://www.openshift.com
 *
 */


const dataServer = express();



dataServer.use(express.static('www'));
//app.use('/data', express.static('data'))

dataServer.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


dataServer.get('/', function (req, res) {
	res.sendFile("index.html");
});




dataServer.listen(dataport,ipaddress, function () {
	console.log('Data Server listening on port 3030 on '+ipaddress+' !');
});







// must be at last
dataServer.use(function (req, res, next) {
	fs.readFile("www/index.html", function (err, data) {
		res.status(404).write(data);
		res.end();
	});
});






/****************************
 *                          *
 *      PAPER SERVER        ****************************************************
 *                          *
 ****************************


 * This part is used for serving the exam paper pdfs.
 *
 *
 * This part merged in app.js as it will  be easier to run multiple ports in same process in dataServer like openshift http://www.openshift.com
 *
 */


const paperServer = express();



paperServer.use(express.static('www/exampapers'));
paperServer.use(express.static('data/exam'));
//app.use('/data', express.static('data'))

paperServer.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


//paperServer.get('/', function (req, res) {
//	res.sendFile("index.html");
//});


paperServer.get('/papers', function (req, res) {
	//console.log("request");
	//console.log(req.query);
	var requestpath = req.query.path;
	var path = "data/exam" + requestpath;

	var sendableObject = {
		"path": requestpath,
		"dirs": [],
		"files": []
	};

	//console.log(username);



	fs.readdir(path, function (err, pathcontents) {
		//console.log(pathcontents);
		for (item in pathcontents) {
			//console.log(pathcontents[item]);
			if (fs.statSync(path + "/" + pathcontents[item]).isDirectory()) {

				sendableObject.dirs.push(pathcontents[item]);

				//console.log(sendableObject);
			} else {
				sendableObject.files.push(pathcontents[item]);
				//console.log(sendableObject);
			}

		}
		//console.log(sendableObject);
		res.send(sendableObject);
	});

});



paperServer.listen(paperport,ipaddress, function () {
	console.log('Paper Server listening on port 3040 on '+ipaddress+' !');
});






/*
// must be at last
paperServer.use(function (req, res, next) {
	fs.readFile("www/index.html", function (err, data) {
		res.status(404).write(data);
		res.end();
	});
});
*/
