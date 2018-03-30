var fs = require('fs');
var fr = require('face-recognition');

var detector = fr.FaceDetector();
var recognizer = fr.FaceRecognizer();

var faces = fs.readdirSync("./facerec/faces");

for (var face in faces) {

    console.log(faces[face] + " training started.");

    var imagespath = fs.readdirSync("./facerec/faces/" + faces[face]);
    var images = [];

    for (var image in imagespath) {
        images[image] = fr.loadImage(__dirname + "/facerec/faces/" + faces[face] + "/" + imagespath[image]);
        console.log("processing " + imagespath[image])
    }
    recognizer.addFaces(images, faces[face]);

    //console.log(faces[face] + " added to model.");
}

const modelState = recognizer.serialize();
fs.writeFileSync('model.json', JSON.stringify(modelState));

console.log("all faces added to model.");
