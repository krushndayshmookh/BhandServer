function orderready(user, itemname, ordertime) {

    var i = {
        uname: user,
        item: itemname
    };

    //console.log(i);

    // console.log("k");
    /*
    socket.emit("userready", i, function () {
        console.log("k");
        document.getElementById(itemname + Date.parse(ordertime)).classList.add("green");
    });
    */
    document.getElementById(itemname + Date.parse(ordertime)).classList.add("green");
}

function ordercancel(ordertime, itemname) {
    $.post("/ordercancel", {
        itemdate: ordertime
    }, function (res) {
        if (res == "ok") {
            var k = document.getElementById(itemname + Date.parse(ordertime));
            k.parentNode.removeChild(k);
        }
    });
}

function orderdone(ordertime, itemname) {
    $.post("/orderdone", {
        itemdate: ordertime
    }, function (res) {
        if (res == "ok") {
            var k = document.getElementById(itemname + Date.parse(ordertime));
            k.parentNode.removeChild(k);
        }
    });
    updateEarning();
}
