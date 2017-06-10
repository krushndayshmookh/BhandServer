//==============================================================================

/* 
 * Author: Krushn Dayshmookh
 *
 *  THIS FILE HAS BEEN MADE SPECIFICIALLY TO WORK WITH HEROKU.
 *
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
const touch = require('touch');
//const mongoose = require('mongoose');

var config = require('./config');



var appport = process.env.PORT || 3000;
var mongolaburi = process.env.MONGOLAB_URI || "mongodb://clavi:clavidbpassword@ds117592.mlab.com:17592/clavi";

//var mongolaburi = "mongodb://clavi:clavidbpassword@ds117592.mlab.com:17592/clavi";




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


var app = express();


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


var user = function (uid, uname, type, email, passwd) {
    this.uid = uid;
    this.name = uname;
    this.type = type;
    this.email = email;
    this.password = passwd;
};


var MongoClient = require('mongodb').MongoClient;



// Connection URL
var url = mongolaburi;



// Use connect method to connect to the server









app.get('/login', function (req, res) {

    var username = req.query.uname;

    var password = req.query.pword;

    MongoClient.connect(url, function (err, db) {

        if (err) throw err;

        //console.log("Connected successfully to server");

        var users = db.collection('users');

        users.findOne({
            id: username
        }, function (err1, data) {
            if (err1) throw err1;

            if (data != null) {
                //;
                if (data.password == password) {
                    res.send("true");

                    //console.log(username + " logged in.");
                } else {
                    res.send("false");
                    //console.log(username + " entered incorrect password.");
                }

            } else {
                res.send("invalid");
                //console.log(username + " does not exist.");
            }




            db.close();
        });
    });


});

app.get('/passwordreset', function (req, res) {



    MongoClient.connect(url, function (err, db) {

        if (err) throw err;

        //console.log("Connected successfully to server");

        var users = db.collection('users');

        users.findOne({
            email: req.query.email
        }, function (err1, data) {
            if (err1) throw err1;

            if (data != null) {

                fs.readFile(__dirname + "/data/users/forgotpassword.json", function (err, absentmindeduserslist) {

                    var absentmindedusers = JSON.parse(absentmindeduserslist);


                    absentmindedusers.push(data);

                    fs.writeFile(__dirname + "/data/users/forgotpassword.json", JSON.stringify(absentmindedusers), "utf8", function (err) {
                        if (err) throw 'error writing file: ' + err;
                        res.send("success");
                    });

                });
            } else {
                res.send("failure");
                //console.log(username + " does not exist.");
            }
            db.close();
        });
    });


});





app.get('/userdata', function (req, res) {

    var username = req.query.username;


    fs.readFile(config.userlist, function (err0, userdata) {
        var users = JSON.parse(userdata);


        if (username in users) {

            var userpath = "data/users/" + users[username].type + "/" + username + "/";

            var profilepath = userpath + "profile.json";

            fs.readFile(profilepath, function (err1, profiledata) {


                var profile = JSON.parse(profiledata);


                res.send(profile);
                //console.log("Profile of " + username + " sent.");
            });

        }
    });

});

app.get('/username-name', function (req, res) {

    var username = req.query.user;

    fs.readFile("data/users/users.json", function (err0, userdata) {
        var users = JSON.parse(userdata);

        if (username in users) {

            var userpath = "data/users/" + users[username].type + "/" + username + "/";

            var profilepath = userpath + "profile.json";

            fs.readFile(profilepath, function (err1, profiledata) {

                var profile = JSON.parse(profiledata);

                res.send(profile.Name);
                //console.log("Name of " + username + " sent.");
            });
        }
    });

});




app.get('/notifications', function (req, res) {
    var type = req.query.type;
    //  type can be "departmantal" or "general"



    fs.readFile("data/notifications/" + type + ".json", function (err0, notificationdata) {
        var notifications = JSON.parse(notificationdata);

        res.send(notifications);
        // console.log(type + " notifications sent.");
    });

});





app.get('/attendance', function (req, res) {
    var username = req.query.username;

    fs.readFile("data/users/users.json", function (err0, userdata) {
        var users = JSON.parse(userdata);

        var userpath = "data/users/" + users[username].type + "/" + username + "/";

        var attendancepath = userpath + "attendance.json";

        fs.readFile(attendancepath, function (err1, attendancedata) {


            var attendance = JSON.parse(attendancedata);

            res.send(attendance);
            //  console.log("Attendance of " + username + " sent.");


        });
    });

});

app.get('/academics', function (req, res) {
    var username = req.query.username;

    fs.readFile("data/users/users.json", function (err0, userdata) {
        var users = JSON.parse(userdata);

        var userpath = "data/users/" + users[username].type + "/" + username + "/";

        var academicspath = userpath + "academics.json";

        fs.readFile(academicspath, function (err1, academicsdata) {


            var academics = JSON.parse(academicsdata);

            res.send(academics);
            // console.log("Academics of " + username + " sent.");


        });

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



app.use(express.static('www'));


app.get('/rates', function (req, res) {

    fs.readFile("data/canteen/rates.json", function (err, ratedata) {
        var rates = JSON.parse(ratedata);
        res.send(rates);

    });

});

app.get('/canteen/order', function (req, res) {


    var order = {
        time: new Date(),
        item: req.query.item,
        category: req.query.category,
        quantity: req.query.quantity,
        status: "open",
        username: req.query.username
    }; // Get canteen orders file and append the request to the file using writefile.

    // that will be done here.





    // handle for student side.

    MongoClient.connect(url, function (err, db) {

        if (err) throw err;

        //console.log("Connected successfully to server");

        var users = db.collection('users');

        users.findOne({
            id: req.query.username
        }, function (err1, userdata) {
            if (err1) throw err1;

            if (userdata != null) {


                fs.readFile(__dirname + "/data/canteen/rates.json", function (err, ratedata) {

                    var rates = JSON.parse(ratedata);

                    order.rate = rates[order.category][order.item];

                    var usercanteenpath = "data/users/" + userdata.type + "/" + req.query.username + "/data/canteen/orders.json";

                    fs.readFile(usercanteenpath, function (err, orderdata) {



                        var orders = JSON.parse(orderdata);
                        //console.log(orders);

                        orders.push(order);

                        fs.writeFile(usercanteenpath, JSON.stringify(orders), "utf8", function (err) {
                            res.send("success");
                        });

                    });

                });


            } else {
                res.send("failure");
                // console.log(username + " does not exist.");
            }




            db.close();
        });
    });

});


app.get('/canteen/myorders', function (req, res) {

    var username = req.query.username;

    MongoClient.connect(url, function (err, db) {

        if (err) throw err;

        //console.log("Connected successfully to server");

        var users = db.collection('users');

        users.findOne({
            id: req.query.username
        }, function (err1, userdata) {
            if (err1) throw err1;

            if (userdata != null) {

                var usercanteenpath = "data/users/" + userdata.type + "/" + req.query.username + "/data/canteen/orders.json";

                fs.readFile(usercanteenpath, function (err, orderdata) {
                    var orders = JSON.parse(orderdata);
                    res.send(orders);
                });

            } else {
                res.send("failure");
                // console.log(username + " does not exist.");
            }
            db.close();
        });
    });

});

app.get('/canteen/myorders/clear', function (req, res) {

    var username = req.query.username;

    MongoClient.connect(url, function (err, db) {

        if (err) throw err;

        //console.log("Connected successfully to server");

        var users = db.collection('users');

        users.findOne({
            id: req.query.username
        }, function (err1, userdata) {
            if (err1) throw err1;

            if (userdata != null) {

                var usercanteenpath = "data/users/" + userdata.type + "/" + req.query.username + "/data/canteen/orders.json";

                fs.writeFile(usercanteenpath, "[]", "utf8", function (err) {

                    res.send("success");
                });

            } else {
                res.send("failure");
                // console.log(username + " does not exist.");
            }
            db.close();
        });
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
 *
 */



app.use(express.static('www/exampapers'));
app.use(express.static('data/exam'));



app.get('/papers', function (req, res) {

    var requestpath = req.query.path;
    var path = "data/exam" + requestpath;

    var sendableObject = {
        "path": requestpath,
        "dirs": [],
        "files": []
    };



    fs.readdir(path, function (err, pathcontents) {

        for (var item in pathcontents) {

            if (fs.statSync(path + "/" + pathcontents[item]).isDirectory()) {

                sendableObject.dirs.push(pathcontents[item]);

            } else {
                sendableObject.files.push(pathcontents[item]);

            }

        }

        res.send(sendableObject);
    });

});







/****************************
 *                          *
 *       CHAT SERVER        ****************************************************
 *                          *
 ****************************


 * This part is used for forum chat will be accessible througn the app.
 *
 */


// Setup basic express server
//var chat = express();
var appserver = require('http').createServer(app);
var io = require('socket.io')(appserver);

appserver.listen(appport, function () {
    console.log('Server listening at port %d', appport);
});


// Chatroom

var numUsers = 0;

io.on('connection', function (socket) {
    var addedUser = false;

    // when the client emits 'new message', this listens and executes
    socket.on('new message', function (data) {
        // we tell the client to execute 'new message'
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });

    // when the client emits 'add user', this listens and executes
    socket.on('add user', function (username) {
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function () {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        if (addedUser) {
            --numUsers;

            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
});


// must be at last
app.use(function (req, res, next) {
    fs.readFile("www/error.html", function (err, data) {
        res.status(404).write(data);
        res.end();
    });
});
