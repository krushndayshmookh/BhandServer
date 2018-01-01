var loggeduser = Cookies.get('username-name');
//console.log(loggeduser);

$(document).ready(function () {
    Materialize.toast("Welcome " + loggeduser + "!", 3000);
    getAllNotifications();
    // hideWait();
    var firstuse = Cookies.get("firstuse");
    if (firstuse == undefined) {
        Cookies.set("firstuse", "false", {
            expires: 108,
            path: '/'
        });
        $('#menu-btn-tap-target').tapTarget('open');
    }
});








function getNotifications(type, section) {
    $.get(hostaddress + "/notifications", {
        type: type
    }, function (notifications) {
        noticelist = "";
        for (var notice in notifications[section]) {

            for (var x in notifications[section][notice]) {
                noticelist = noticelist.concat("<a href='" + notifications[section][notice][x] + "'>" + x + "</a><br>");
                //console.log(x);

            }
            //console.log(noticelist);
            document.getElementById("notification-" + type + "-" + section).innerHTML = noticelist;
            document.getElementById("notification-small-" + type + "-" + section).innerHTML = noticelist;
        }
    });
}

function getAllNotifications() {
    getNotifications("general", "notices");
    getNotifications("departmental", "notices");
    getNotifications("general", "events");
    getNotifications("departmental", "events");
}
