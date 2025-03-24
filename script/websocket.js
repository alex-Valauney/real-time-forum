import { sortUser } from "./users"

export function connWebSocket(user) {
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
            let parsedData = JSON.parse(e.data)
            redirect = {
                getPMList: getPMList
            }
            redirect[parsedData[method]](parsedData, conn)
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

async function getPMList(userLists, conn, user) {
    try {
        let response = await fetch(`/pm?id=${user}`, {
            method: "GET"
        })

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des posts");
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
    const mp = await response.json()
    console.log(userLists[allUsers], userLists[onlineUsers], mp, user, conn)
    sortUser(userLists[allUsers], userLists[onlineUsers], mp, user, conn)

}