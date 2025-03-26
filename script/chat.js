export function openChatBox(user, userTo, conn) {
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
            conn.send(message)
            input.value = ""
            console.log("Message envoyé :", message)
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