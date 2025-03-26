export function openChatBox(userTo, conn, userClient) {
    conn.send(user, userTo)
    let modal = document.createElement("div")
    //modal.id = `chat-${userTo.Id}`

    let closeBtn = document.createElement("button")
    closeBtn.textContent = "X"
    closeBtn.addEventListener("click", function() {
        modal.remove()
    })

    let chatContent = document.createElement("div")
    chatContent.id = "chatContent"

    let input = document.createElement("input")
    input.type = "text"
    input.id = "chatInput"
    input.placeholder = "Écrire un message..."

    let sendBtn = document.createElement("button")
    let imgSendBtn = document.createElement("img")
    imgSendBtn.src = "./pics/send.svg"
    sendBtn.appendChild(imgSendBtn)
    sendBtn.addEventListener("click", function() {
        let message = input.value.trim()
        if (message) {
            const fullMessage = {
                user_to : userTo,
                user_from : userClient,
                content : message,
                date : new Date.now()
            }
            conn.send(JSON.stringify(fullMessage))
            input.value = ""
        }
    })

    modal.appendChild(closeBtn)
    modal.appendChild(chatContent)
    modal.appendChild(input)
    modal.appendChild(sendBtn)

    document.body.appendChild(modal)
}

export function receiveMessage(message) {

}