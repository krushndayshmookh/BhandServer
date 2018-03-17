function orderready(user, itemname) {
    socket.emit.post("userready", {
        uname: user,
        item: itemname
    }, function () {
        document.getElementById(itemname + Date.parse(ordertime)).classList.add("green");
    });
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
