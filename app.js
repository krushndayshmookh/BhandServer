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
const bodyParser = require('body-parser');


//var config = require('./config');

var app = express();

var appport = process.env.PORT || 3000;
//var mongolaburi = process.env.MONGOLAB_URI || "mongodb://clavi:clavidbpassword@ds117592.mlab.com:17592/clavi";
var mongolaburi = "mongodb://clavi:clavidbpassword@ds117592.mlab.com:17592/clavi";
//var mongolaburi = "mongodb://127.0.0.1:27017";



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



app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/*   --- this is user prototype that is saved in database
var user = function (uid, uname, type, email, passwd) {
    this.uid = uid;
    this.name = uname;
    this.type = type;
    this.email = email;
    this.password = passwd;
};
*/

var MongoClient = require('mongodb').MongoClient;



// Connection URL
var url = mongolaburi;



// Use connect method to connect to the server


// https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies





var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/uploads') //you tell where to upload the files,
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.png')
    }
});

var upload = multer({
    storage: storage
});

//app.use(upload.array());


app.post('/attendance', upload.single('att'), (req, res) => {

    //console.log(req.query);
    //console.log(req.body);
    //console.log(req.file);


    if (!req.file) {
        //console.log("No file received");
        return res.send("fail");

    } else {
        //console.log('file received');
        return res.send("success");
    }
});









// -----------------


app.post('/login', function (req, res) {
    //console.log(req.body);

    var username = req.body.uname;

    var password = req.body.pword;

    MongoClient.connect(url, function (err, db) {

        if (err) {
            throw err;
        }

        //console.log("Connected successfully to server");

        var users = db.collection('users');

        users.findOne({
            id: username
        }, function (err1, data) {
            if (err1) {
                throw err1;
            }

            if (data !== null) {

                if (data.password == password) {
                    res.send(data);

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

app.post('/passwordreset', function (req, res) {



    MongoClient.connect(url, function (err, db) {

        if (err) {
            throw err;
        }

        //console.log("Connected successfully to server");

        var users = db.collection('users');

        users.findOne({
            email: req.body.email
        }, function (err1, data) {
            if (err1) {
                throw err1;
            }

            if (data !== null) {

                fs.readFile(__dirname + "/data/users/forgotpassword.json", function (err, absentmindeduserslist) {

                    var absentmindedusers = JSON.parse(absentmindeduserslist);

                    absentmindedusers.push(data);

                    fs.writeFile(__dirname + "/data/users/forgotpassword.json", JSON.stringify(absentmindedusers), "utf8", function (err) {
                        if (err) {
                            throw 'error writing file: ' + err;
                        }
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

    MongoClient.connect(url, function (err, db) {

        if (err) {
            throw err;
        }

        //console.log("Connected successfully to server");

        var users = db.collection('users');

        users.findOne({
            id: username
        }, function (err1, data) {
            if (err1) {
                throw err1;
            }

            if (data !== null) {
                var userpath = "/data/users/" + data.type + "/" + username + "/";

                var profilepath = userpath + "profile.json";
                fs.readFile(__dirname + profilepath, function (err2, profiledata) {

                    var profile = JSON.parse(profiledata);

                    res.send(profile);
                    //console.log("Profile of " + username + " sent.");
                });


            }

            db.close();
        });
    });


});




app.get('/notifications', function (req, res) {
    var type = req.query.type;
    //  type can be "departmantal" or "general"



    fs.readFile(__dirname + "/data/notifications/" + type + ".json", function (err0, notificationdata) {
        var notifications = JSON.parse(notificationdata);

        res.send(notifications);
        // console.log(type + " notifications sent.");
    });

});





app.get('/attendance', function (req, res) {
    var username = req.query.username;

    MongoClient.connect(url, function (err, db) {

        if (err) {
            throw err;
        }

        //console.log("Connected successfully to server");

        var users = db.collection('users');

        users.findOne({
            id: username
        }, function (err1, data) {
            if (err1) {
                throw err1;
            }

            if (data !== null) {
                var userpath = "/data/users/" + data.type + "/" + username + "/";
                //console.log("Connected user");

                var attendancepath = userpath + "attendance.json";

                fs.readFile(__dirname + attendancepath, function (err1, attendancedata) {

                    var attendance = JSON.parse(attendancedata);

                    res.send(attendance);
                    //res.json(attendancedata);
                    //console.log("Attendance of " + username + " sent.");
                });

            }

            db.close();
        });
    });

});



app.get('/academics', function (req, res) {
    var username = req.query.username;



    MongoClient.connect(url, function (err, db) {

        if (err) {
            throw err;
        }

        //console.log("Connected successfully to server");

        var users = db.collection('users');

        users.findOne({
            id: username
        }, function (err1, data) {
            if (err1) {
                throw err1;
            }

            if (data !== null) {
                var userpath = "/data/users/" + data.type + "/" + username + "/";

                var academicspath = userpath + "academics.json";

                fs.readFile(__dirname + academicspath, function (err1, academicsdata) {

                    var academics = JSON.parse(academicsdata);

                    res.send(academics);
                    // console.log("Academics of " + username + " sent.");


                });


            }

            db.close();
        });
    });


});







/****************************
 *                          *
 *       TRIAL-SERVER       ****************************************************
 *                          *
 ****************************


 * This part is used for serving the experiments.
 *
 */

app.post("/trialform", function (req, res) {
    console.log(req.body.check);
    console.log(req.body.gender);
    res.send("ok");
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



app.use(express.static(__dirname + '/www'));


app.get('/rates', function (req, res) {

    fs.readFile(__dirname + "/data/canteen/rates.json", function (err, ratedata) {
        var rates = JSON.parse(ratedata);
        res.send(rates);

    });

});

app.post('/canteen/order', function (req, res) {
    var orders = req.body.orders;
    var username = orders[0]["username"];

    MongoClient.connect(url, function (err, db) {

        if (err) {
            throw err;
        }

        //console.log("Connected successfully to server");

        var users = db.collection('users');

        users.findOne({
            id: username
        }, function (err1, userdata) {
            if (err1) {
                throw err1;
            }

            if (userdata !== null) {

                var usercanteenpath = "/data/users/" + userdata.type + "/" + username + "/data/canteen/orders.json";

                fs.readFile(__dirname + usercanteenpath, function (err, orderdata) {

                    var oldorders = JSON.parse(orderdata);

                    //console.log(oldorders);

                    for (var order in orders) {
                        orders[order]["status"] = "open";
                        oldorders.push(orders[order]);
                    }



                    fs.writeFile(__dirname + usercanteenpath, JSON.stringify(oldorders), "utf8", function (err) {
                        if (err) {
                            throw err;
                        }

                        fs.readFile(__dirname + "/data/canteen/orders.json", function (err, orderlist) {

                            var openorders = JSON.parse(orderlist);

                            for (var order in orders) {

                                openorders["open"].push(orders[order]);
                            }


                            fs.writeFile(__dirname + "/data/canteen/orders.json", JSON.stringify(openorders), "utf8", function (err) {
                                if (err) {
                                    throw err;

                                }
                                res.send("success");
                            });

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



    MongoClient.connect(url, function (err, db) {

        if (err) {
            throw err;
        }

        //console.log("Connected successfully to server");

        var users = db.collection('users');

        users.findOne({
            id: req.query.username
        }, function (err1, userdata) {
            if (err1) {
                throw err1;
            }

            if (userdata !== null) {

                var usercanteenpath = "/data/users/" + userdata.type + "/" + req.query.username + "/data/canteen/orders.json";

                fs.readFile(__dirname + usercanteenpath, function (err, orderdata) {
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



    MongoClient.connect(url, function (err, db) {

        if (err) {
            throw err;
        }

        //console.log("Connected successfully to server");

        var users = db.collection('users');

        users.findOne({
            id: req.query.username
        }, function (err1, userdata) {
            if (err1) {
                throw err1;
            }

            if (userdata !== null) {

                var usercanteenpath = "/data/users/" + userdata.type + "/" + req.query.username + "/data/canteen/orders.json";

                fs.writeFile(__dirname + usercanteenpath, "[]", "utf8", function (err) {
                    if (err) {
                        throw err;
                    }
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


app.get('/openorders', function (req, res) {
    fs.readFile(__dirname + "/data/canteen/orders.json", function (err, orderdata) {
        var orders = JSON.parse(orderdata);
        res.json(orders["open"]);
    });
});

app.get('/closedorders', function (req, res) {
    fs.readFile(__dirname + "/data/canteen/orders.json", function (err, orderdata) {
        var orders = JSON.parse(orderdata);
        res.json(orders["closed"]);
    });
});




app.post("/ordercancel", function (req, res) {
    var itemid = req.body.itemdate;

    fs.readFile(__dirname + "/data/canteen/orders.json", function (err, orderdata) {
        var orders = JSON.parse(orderdata);

        var username;

        for (var item in orders["open"]) {
            if (orders["open"][item]["time"] == itemid) {
                username = orders["open"][item]["username"];

                orders["open"].splice(item, 1);


            }
        }


        fs.writeFile(__dirname + "/data/canteen/orders.json", JSON.stringify(orders), "utf8", function (err) {
            if (err) {
                throw err;
            }


            // console.log(username);


            MongoClient.connect(url, function (err, db) {

                if (err) {
                    throw err;
                }

                var users = db.collection('users');

                users.findOne({
                    id: username
                }, function (err1, userdata) {
                    if (err1) {
                        throw err1;
                    }

                    if (userdata !== null) {

                        var usercanteenpath = "/data/users/" + userdata.type + "/" + username + "/data/canteen/orders.json";

                        fs.readFile(__dirname + usercanteenpath, function (err, userorders) {
                            var oldorders = JSON.parse(userorders);
                            //console.log(oldorders);
                            for (var order in oldorders) {

                                //console.log(oldorders[order]["time"]);
                                // console.log(itemid);

                                if (oldorders[order]["time"] == itemid && oldorders[order]["status"] == "open") {
                                    //console.log(oldorders[order]["time"]);
                                    //console.log(oldorders[order]["status"]);
                                    oldorders[order]["status"] = "cancel";
                                    //console.log(oldorders[order]["status"]);
                                    break;
                                }
                            }

                            fs.writeFile(__dirname + usercanteenpath, JSON.stringify(oldorders), "utf8", function (err) {

                                if (err) {
                                    throw err;
                                }
                                res.send("ok");
                            });
                        });
                    }
                    db.close();
                });
            });
        });
    });
});




app.post("/orderdone", function (req, res) {

    var itemid = req.body.itemdate;

    fs.readFile(__dirname + "/data/canteen/orders.json", function (err, orderdata) {
        var orders = JSON.parse(orderdata);

        var username;

        for (var item in orders["open"]) {
            if (orders["open"][item]["time"] == itemid) {
                username = orders["open"][item]["username"];

                var earn = orders["open"][item]["rate"] * orders["open"][item]["quantity"];
                orders["earnings"] = orders["earnings"] + earn;
                orders["closed"].push(orders["open"][item]);

                orders["open"].splice(item, 1);
            }
        }


        fs.writeFile(__dirname + "/data/canteen/orders.json", JSON.stringify(orders), "utf8", function (err) {
            if (err) {
                throw err;
            }


            // console.log(username);


            MongoClient.connect(url, function (err, db) {

                if (err) {
                    throw err;
                }

                var users = db.collection('users');

                users.findOne({
                    id: username
                }, function (err1, userdata) {
                    if (err1) {
                        throw err1;
                    }

                    if (userdata !== null) {

                        var usercanteenpath = "/data/users/" + userdata.type + "/" + username + "/data/canteen/orders.json";

                        fs.readFile(__dirname + usercanteenpath, function (err, userorders) {
                            var oldorders = JSON.parse(userorders);
                            //console.log(oldorders);
                            for (var order in oldorders) {

                                if (oldorders[order]["time"] == itemid && oldorders[order]["status"] == "open") {
                                    oldorders[order]["status"] = "closed";
                                    break;
                                }
                            }

                            fs.writeFile(__dirname + usercanteenpath, JSON.stringify(oldorders), "utf8", function (err) {

                                if (err) {
                                    throw err;
                                }
                                res.send("ok");
                            });
                        });
                    }
                    db.close();
                });
            });
        });
    });
});

app.get("/earnings", function (req, res) {
    fs.readFile(__dirname + "/data/canteen/orders.json", function (err, orderdata) {
        var orders = JSON.parse(orderdata);
        var k = orders["earnings"];
        res.json(k);
    });
});


app.get("/menu-card", function (req, res) {
    fs.readFile(__dirname + "/data/canteen/rates.json", function (err, orderdata) {
        var orders = JSON.parse(orderdata);
        res.json(orders);
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



app.use(express.static(__dirname + '/www/exampapers'));
app.use(express.static(__dirname + '/data/exam'));



app.get('/papers', function (req, res) {

    var requestpath = req.query.path;
    var path = "/data/exam" + requestpath;

    var sendableObject = {
        "path": requestpath,
        "dirs": [],
        "files": []
    };



    fs.readdir(__dirname + path, function (err, pathcontents) {

        for (var item in pathcontents) {

            if (fs.statSync(__dirname + path + "/" + pathcontents[item]).isDirectory()) {

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
        if (addedUser) {
            return;
        }

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
    /*
        socket.on("userready", function (data) {
            console.log("k");

            socket.broadcast.emit('orderready', data);
            console.log("k");

        });

        socket.on('join', function (data) {
            console.log(data);
        });
    */
});


// must be at last
app.use(function (req, res) {
    fs.readFile(__dirname + "/www/error.html", function (err, data) {
        res.status(404).write(data);
        res.end();
    });
});
