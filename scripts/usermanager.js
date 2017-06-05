/*



     THIS FILE DOES NOT WORK YET.



*/








var fs = require("fs");
var config = require("../config")


function checkUser(username) {

	//console.log("../" + config.userlist);
	//console.log(username);

	var found;
	console.log("value" + fs.readFile(config.userlist, function (err, userdata) {
		users = JSON.parse(userdata);

		//console.log(users);
		//console.log(userdata);
		//console.log(username);
		//console.log(users[username].type);


		if (username in users) {

			found = true;

		} else {
			found = false;
		}
		console.log("status = " + found);
		return found;
	}));
}

function checkPassword(username, password) {
	fs.readFile("../" + config.userlist, function (err, userdata) {
		users = JSON.parse(userdata);

		//console.log(users);
		//console.log(JSON.parse(data));
		//console.log(username);
		//console.log(users[username].type);
		if (users[username].password == password) {

			return true;

		} else {
			return false;
		}
	});
}


module.exports = {
	checkUser: checkUser,
	checkPassword: checkPassword
}
