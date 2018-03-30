//==============================================================================

/*
 * Author: Krushn Dayshmookh
 */

var MongoClient = require('mongodb').MongoClient;
var mongolaburi = "mongodb://clavi:clavidbpassword@ds117592.mlab.com:17592/clavi";
//var mongolaburi = "mongodb://127.0.0.1:27017";


var users = [
    {
        id: "2016ACSC0100015",
        name: "Rahul Manusmare",
        type: "students",
        email: "manusmare_rahul.ghrcecs@gmail.com",
        password: "2016ACSC0100015"
    },
    {
        id: "2016ACSC0100016",
        name: "Karan Bagle",
        type: "students",
        email: "bagle_karan.ghrcecs@gmail.com",
        password: "2016ACSC0100016"
    },
    {
        id: "2016ACSC0101010",
        name: "Akash Thakre",
        type: "students",
        email: "thakre_akash.ghrcecs@gmail.com",
        password: "2016ACSC0101010"
    },
    {
        id: "2016ACSC0101011",
        name: "Shefali Dayshmookh",
        type: "students",
        email: "Dayshmookh_shefali.ghrcecs@gmail.com",
        password: "2016ACSC0101011"
    },
    {
        id: "2016ACSC0101012",
        name: "Vaibhav Pathak",
        type: "students",
        email: "pathak_vaibhav.ghrcecs@gmail.com",
        password: "2016ACSC0101012"
    },
    {
        id: "2016ACSC0101013",
        name: "Vitika Jha",
        type: "students",
        email: "jha_vitika.ghrcecs@gmail.com",
        password: "2016ACSC0101013"
    },
    {
        id: "2016ACSC0101078",
        name: "Sankul Anmadwar",
        type: "students",
        email: "anmadwar_sankul.ghrcecs@gmail.com",
        password: "2016ACSC0101078"
    },
    {
        id: "2016ACSC0111045",
        name: "Piyush Joshi",
        type: "students",
        email: "joshi_piyush.ghrcecs@gmail.com",
        password: "2016ACSC0111045"
    },
    {
        id: "2016ACSC0117215",
        name: "Savneet Chhatwal",
        type: "students",
        email: "chhatwal_savneet.ghrcecs@gmail.com",
        password: "2016ACSC0117215"
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


