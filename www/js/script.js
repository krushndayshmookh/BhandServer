const server = "192.168.225.42";

$(document).ready(function () {
	// initialize jquery
	$('.button-collapse').sideNav();

	/*$('ul.tabs').tabs({
		swipeable: true
	});*/
	$('ul.tabs').tabs();
	//$('.parallax').parallax();
	/*
		$('.carousel.carousel-slider').carousel({
			fullWidth: true
		});
		$('.carousel').carousel();*/
});


$("#reset-box-btn").click(function () {
	$("#login-box").slideUp();
	$("#password-reset-box").slideDown();
	console.log("hi")
});

$("#reset-cancel-btn").click(function () {
	$("#login-box").slideDown();
	$("#password-reset-box").slideUp();
});


$("#sign-in-btn").click(function () {
	user = {
		uname: $("#username").val(),
		pword: $("#password").val()
	}
	$.get("/trial", user, function (data) {
		console.log(data);
		$("#sign-in-btn").html(data)
	});
})
