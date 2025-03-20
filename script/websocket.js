export function connWebSocket() {
    let conn
    //Creating the front websocket connection 
    if (window["WebSocket"]) {
        conn = new WebSocket("ws://" + document.location.host + "/ws")
        let output = document.querySelector("#output")
        conn.onopen = function (e) {
            conn.send("New client")
            console.log("WS working")
            output.textContent = "connection successful"
        }
        conn.onclose = function (e) { //Display that the user was disconnected of the ws 
            console.log("Closed WS")
        }
        conn.onerror = function (e) {
            output.textContent = "error : " + e.data
        }
        conn.onmessage = function (e) { //Will be splitted in further cases depending on the nature of the message
            output.textContent = "received : " + e.data
        }
    } else {
        console.log("Your browser does not support WebSockets")
    }
    // Gestion du bouton de test WebSocket
    document.getElementById("testbutWS").onclick = function (e) {
        let textinputdata = document.querySelector("#testWS").value
        console.log(textinputdata)
        conn.send(textinputdata)
    }
}