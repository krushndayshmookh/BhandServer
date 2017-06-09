var MongoClient = require('mongodb').MongoClient;
var mongolaburi = "mongodb://clavi:clavidbpassword@ds117592.mlab.com:17592/clavi";


MongoClient.connect(mongolaburi, function (err, db) {

    if (err) throw err;

    console.log("Connected successfully to server");

    var users = db.collection('users');

    users.findOne({
        uid: "username"
    }, function (err1, data) {
        if (err1) throw err1;

        console.log(data);

        db.close();
    });



});
