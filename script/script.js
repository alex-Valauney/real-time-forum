export function init() {
    window.onload = function () {
        var conn;
        
        if (window["WebSocket"]) {
            conn = new WebSocket(document.location.origin);
            conn.onclose = function (evt) {
                console.log("Closed WS")
            };
            conn.onmessage = function (evt) {
                console.log(evt.data)
            };
        } else {
            console.log("Your browser does not support WebSockets")
        }
        
    }
    onClicksFunctions()
}


function onClicksFunctions() {
    onLoadPage('register')
    let currentLoad = document.body.querySelector('section:not(.hidden)')
    document.getElementById('linkLogin').onclick = function (e) {
        onLoadPage('login', currentLoad.id)
        currentLoad = document.body.querySelector('section:not(.hidden)')
    }

    document.getElementById('linkRegister').onclick = function (e) { 
        onLoadPage('register', currentLoad.id)
        currentLoad = document.body.querySelector('section:not(.hidden)')
    }
}

function onLoadPage(newSection, oldSection) {
    document.getElementById(newSection).classList.remove('hidden')
    if (oldSection) {
        document.getElementById(oldSection).classList.add('hidden')
    }
}

/* document.getElementsByClassName
document.getElementById("form").onsubmit = function () {
    if (!conn) {
        return false;
    }
    if (!msg.value) {
        return false;
    }
    conn.send(msg.value);
    msg.value = "";
    return false;
}; */