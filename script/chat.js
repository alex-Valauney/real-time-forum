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
    chatContent.addEventListener("scroll", throttlePM(handleScrollPM(userClient, userTo, chatContent), 200))
    
    const input = document.createElement("input")
    input.type = "text"
    input.id = "chatInput"
    input.placeholder = "Écrire un message..."

    let lastSentTime = 0
    input.addEventListener("input", () => {
        const now = dateConvertor(Date.now())
        if (now - lastSentTime < 1000) return

        conn.send(JSON.stringify({
            user_to : userTo.Id,
            user_from : userClient.Id,
            auth : userClient.Nickname,
            typing: true,
        }))
      })

    const sendBtn = document.createElement("button")
    const imgSendBtn = document.createElement("img")

    imgSendBtn.src = "./pics/send.svg"
    imgSendBtn.classList.add("BtnSend")
    
    sendBtn.appendChild(imgSendBtn)

    sendBtn.addEventListener("click", function() {
        let message = input.value.trim()
        if (message) {
            const fullMessage = {
                user_to : userTo.Id,
                user_from : userClient.Id,
                auth : userClient.Nickname,
                content : message,
                date : dateConvertor(Date.now()),
                typing : false,
            }
            conn.send(JSON.stringify(fullMessage))
            input.value = ""

           createMessage(fullMessage, chatContent)
        }
    })

    modal.appendChild(closeBtn)
    modal.appendChild(chatContent)
    modal.appendChild(input)
    modal.appendChild(sendBtn)

    document.body.appendChild(modal)
}

export function createMessage(objPM, source) {
    const divMessage = document.createElement('div')
    let messageContent = document.createElement("span")
    messageContent.textContent = `${objPM.content}` || ''
    let messageTime = document.createElement("span")
    messageTime.textContent = `${objPM.date}` || ''
    let messageAuth = document.createElement("span")
    messageAuth.textContent = `${objPM.auth}`

    divMessage.appendChild(messageContent)
    divMessage.appendChild(messageAuth)
    divMessage.appendChild(messageTime)
    source.appendChild(divMessage)
}

async function scrollPM(userClient, userTo, chatContent) {

    const listPM = await getSpePM(userClient, userTo)
    listPM.forEach(pm => {
        const divMessage = document.createElement('div')

        divMessage.classList.add(`pm-${pm.Id}`)
        
        
        let messageContent = document.createElement("span")
        messageContent.textContent = `${pm.Content}`
        let messageTime = document.createElement("span")
        messageTime.textContent = `${pm.Date}`
        let messageAuth = document.createElement("span")
        messageAuth.textContent = (userClient.Id === pm.User_from) ? `${userClient.Nickname}` : `${userTo.Nickname}`

        if (messageAuth.textContent === userClient.Nickname) {
            divMessage.classList.add('msgEnvoi')
        }
    
        if (messageAuth.textContent === userTo.Nickname) {
            divMessage.classList.add('msgReçu')
        }

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
function handleScrollPM(userClient, userTo, chatContent) {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.body.offsetHeight;
    if (scrollPosition >= pageHeight - 100 && !isLoading) {
        isLoading = true;
        scrollPM(userClient, userTo, chatContent).finally(() => {
            isLoading = false;
        });
    }
}

export function dateConvertor(time) {
    const date = new Date(time);
    
    const pad = (num) => (num < 10 ? '0' + num : num);
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // Les mois commencent à 0
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}