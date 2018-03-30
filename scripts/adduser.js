//==============================================================================

/*
 * Author: Krushn Dayshmookh
 */

var MongoClient = require('mongodb').MongoClient;
//var mongolaburi = "mongodb://clavi:clavidbpassword@ds117592.mlab.com:17592/clavi";
var mongolaburi = "mongodb://127.0.0.1:27017";


var users = [{
        id: "2016ACSC0108072",
        name: "Krushn Dayshmookh",
        type: "students",
        email: "krushndayshmookh@gmail.com",
        password: "2016ACSC0108072"
    },
    {
        id: "2016ACSC0101067",
        name: "Mrunalini Dudhagawali",
        type: "students",
        email: "dudhagawali@gmail.com",
        password: "2016ACSC0101067"
    },
    {
        id: "samplestudent",
        name: "Eclair",
        type: "students",
        email: "whatdoyouthink@gmail.com",
        password: "samplestudentpassword"
    },
    {
        id: "sampleteacher",
        name: "Octopus",
        type: "teachers",
        email: "someteachermail@gmail.com",
        password: "sampleteacherpassword"
	},


    {
        id: "octocat",
        name: "Master Octocat",
        type: "admins",
        email: "superduperemailyoudontknow",
        password: "octocatpassword"

	}


];


/*
{
        id: "trial",
        name: "Trial",
        type: "students",
        email: "trial",
        password: "trial"
    }

    */

// Connection URL
var url = mongolaburi;
MongoClient.connect(url, function (err, db) {
    if (err) throw err;

    db.collection("users").insert(users, function (err1, res) {
        if (err1) throw err1;
        console.log("Number of records inserted: " + res.insertedCount);
        db.close();
    });
});


