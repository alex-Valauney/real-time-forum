import { createMessage } from "./chat.js"
import { getLastPMList } from "./fetches.js"
import { addUserElem, sortUser } from "./users.js"

export function connWebSocket(userClient) {
    let conn
    //Creating the front websocket connection 
    if (window["WebSocket"]) {
        conn = new WebSocket("ws://" + document.location.host + "/ws")
        let output = document.querySelector("#output")
        conn.onopen = function (e) {
            console.log("WS working")
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
            const redirect = {
                userListProcess: userListProcess,
                newPM : newPM,
                typingDiv, typingDiv,
            }
            redirect[parsedData["Method"]](parsedData, conn, userClient)
        }
        // Gestion du bouton de test WebSocket
        document.getElementById("testbutWS").onclick = function (e) {
            let textinputdata = document.querySelector("#testWS").value
            let obj = {user_from: userClient.Id, user_to: 2, content: textinputdata, date: "aujourd'hui"}
            conn.send(JSON.stringify(obj))
        }
    } else {
        console.log("Your browser does not support WebSockets")
    }
}

async function userListProcess(userLists, conn, userClient) {
    const pmClient = await getLastPMList(userClient.Id)

    let obj = sortUser(userLists["AllUsers"], userLists["OnlineUsers"], pmClient, userClient)

    const userListOn = document.getElementById("onlineUser")
    const userListOff = document.getElementById("offlineUser")
    userListOn.replaceChildren()
    userListOn.textContent = "Online : "
    userListOff.replaceChildren()
    userListOff.textContent = "Offline : "

    addUserElem(obj.online, true, pmClient, conn, userClient)
    addUserElem(obj.offline, false, pmClient, conn, userClient)
}

let count = 0

function newPM(packageMessage) {
    console.log(packageMessage) //à retirer
    count += 1
    const chatContent = document.getElementById("chatContent")
    
    const userId = packageMessage.user_from

    console.log(userId)

    if (chatContent) {
        createMessage(packageMessage, chatContent, {Id : userId})
        count = 0

    } else {
        const userDiv = document.getElementById(`user-${userId}`)
        let notifDot = document.getElementById(`notifDot-${userId}`)

        if (!notifDot && userDiv) {
            notifDot = document.createElement("div")
            notifDot.id = `notifDot-${userId}`
            notifDot.classList.add("notification-dot")
            userDiv.appendChild(notifDot)
        }

        if (notifDot) {
            notifDot.textContent = 'Message non lu : ' + count
        }
    }
}


const typingTimers = {}

function typingDiv(packageMessage) { 
    const chatContent = document.getElementById("chatContent")
    const userId = packageMessage.user_from
    const notifId = `typing-${userId}`
    if (chatContent) {

        
        if (!document.getElementById(notifId)) {
            
            const animDiv = document.createElement('div')
            animDiv.setAttribute('id', notifId)
            
            animDiv.classList.add('msgReçu')

            let messageAuth = document.createElement("span")
            messageAuth.textContent = `${packageMessage.auth}`
            
            const animSVG = document.createElement('img')
            animSVG.src = "./pics/anim.svg"
            animSVG.classList.add('troisPoints')
            animDiv.prepend(animSVG)
            animDiv.appendChild(messageAuth)
            
            chatContent.appendChild(animDiv)
        }
    }
    
    clearTimeout(typingTimers[userId])
    typingTimers[userId] = setTimeout(() => {
        const elem = document.getElementById(notifId)
        if (elem) elem.remove()
    }, 5000)
}