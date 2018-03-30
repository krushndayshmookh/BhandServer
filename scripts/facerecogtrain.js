var fs = require('fs');
var fr = require('face-recognition');

var detector = fr.FaceDetector();
var recognizer = fr.FaceRecognizer();



//console.log("image loaded");

//const win = new fr.ImageWindow();


var kimage = [];
var pimage = [];

var kroute = fs.readdirSync("./facerec/k");

for (var item in kroute) {
    kimage[item] = fr.loadImage(__dirname+"/facerec/k/"+kroute[item]);
}

recognizer.addFaces(kimage, 'krushn');



var proute = fs.readdirSync("./facerec/p");

for (var item in kroute) {
    pimage[item] = fr.loadImage(__dirname+"/facerec/p/"+proute[item]);
}

recognizer.addFaces(pimage, 'piyush');



const modelState = recognizer.serialize();
fs.writeFileSync('model.json', JSON.stringify(modelState));




//var image = fr.loadImage('./facerec/disgust.png');
//const predictions = recognizer.predictBest(image)
//console.log(predictions);









//console.log(kimage);
//console.log(pimage);

//var rec = detector.detectFaces(image);

//console.log("dectected");

//console.log(rec);

//win.setImage(image);
/*
for (var i in rec){
	win.setImage(rec[i]);
	fr.hitEnterToContinue();

}
*/

