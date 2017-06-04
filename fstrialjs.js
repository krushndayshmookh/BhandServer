function showFolder(folderpath) {
	$.get("http://localhost:3040/papers", {
		path: folderpath
	}, function (data) {
		innerdata = "";
		for (folder in data.dirs) {
			innerdata = innerdata.concat("<a class='btn btn-large' onclick='showFolder(" + '"' + data.path + "/" + data.dirs[folder] + '")' + "'>" + data.dirs[folder] + "<i class='material-icons left'>folder</i></a>");
		}
		for (file in data.files) {
			innerdata = innerdata.concat("<a class='btn btn-large' href='http://localhost:3040/" + data.path + "/" + data.files[file] + "'>" + data.files[file] + "<i class='material-icons left'>file</i></a>");
		}

		document.getElementById("asdf").innerHTML = innerdata;




		//console.log(data);
	});
}

showFolder("");
