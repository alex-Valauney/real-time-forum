import { getSpePM } from "./fetches.js"

export async function openChatBox(userTo, conn, userClient) {
    let modal = document.createElement("div")
    modal.id = `chat-${userTo.Id}`

    let closeBtn = document.createElement("button")
    closeBtn.textContent = "X"
    closeBtn.addEventListener("click", function() {
        modal.remove()
    })
    
    let chatContent = document.createElement("div")
    chatContent.id = "chatContent"
    
    scrollPM(userClient, userTo, chatContent)
    chatContent.addEventListener("scroll", throttlePM(handleScrollPM, 200))
    
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
                user_to : userTo.Id,
                user_from : userClient.Id,
                content : message,
                date : Date.now()
            }
            conn.send(JSON.stringify(fullMessage))
            input.value = ""

            const divMessage = document.createElement('div')
            let messageContent = document.createElement("span")
            messageContent.textContent = `${fullMessage.content}`
            let messageTime = document.createElement("span")
            messageTime.textContent = `${fullMessage.date}`
            let messageAuth = document.createElement("span")
            messageAuth.textContent = `${fullMessage.user_from.Nickname}`

            divMessage.appendChild(messageContent)
            divMessage.appendChild(messageAuth)
            divMessage.appendChild(messageTime)
            chatContent.appendChild(divMessage)
        }
    })

    modal.appendChild(closeBtn)
    modal.appendChild(chatContent)
    modal.appendChild(input)
    modal.appendChild(sendBtn)

    document.body.appendChild(modal)
}

async function scrollPM(userClient, userTo, chatContent) {

    const listPM = await getSpePM(userClient, userTo, chatContent)
    listPM.forEach(pm => {
        const divMessage = document.createElement('div')
        divMessage.classList.add(`pm-${pm.Id}`)
        let messageContent = document.createElement("span")
        messageContent.textContent = `${pm.Content}`
        let messageTime = document.createElement("span")
        messageTime.textContent = `${pm.Date}`
        let messageAuth = document.createElement("span")
        messageAuth.textContent = (userTo.Id === pm.user_From) ? `${userTo.Nickname}` : `${userClient.Nickname}`

        divMessage.appendChild(messageContent)
        divMessage.appendChild(messageAuth)
        divMessage.appendChild(messageTime)

        chatContent.prepend(divMessage)
    })
}

let isLoading
// basic throttle to avoid lodash import
function throttlePM(func, wait, args) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
// function handling down scroll, and start new batch fetch of older pm
function handleScrollPM() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.body.offsetHeight;
    if (scrollPosition >= pageHeight - 100 && !isLoading) {
        isLoading = true;
        scrollPM().finally(() => {
            isLoading = false;
        });
    }
}
