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
    
    await scrollPM(userClient, userTo, chatContent)
    

    let lastScrollTop = 0;

    chatContent.addEventListener("scroll", throttlePM(() => {
        const currentScrollTop = chatContent.scrollTop;
        if (currentScrollTop < lastScrollTop && currentScrollTop < 100) {
            handleScrollPM(userClient, userTo, chatContent);
        }
        
        lastScrollTop = currentScrollTop; 
    }, 200));
    
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
            
            createMessage(fullMessage, chatContent, userClient)
        }
    })
    
    modal.appendChild(closeBtn)
    modal.appendChild(chatContent)
    modal.appendChild(input)
    modal.appendChild(sendBtn)
    
    document.body.appendChild(modal)
    chatContent.scrollTo(0, chatContent.scrollHeight)
}

export function createMessage(objPM, source, userClient) {
    const divMessage = document.createElement('div')
    let messageContent = document.createElement("span")
    messageContent.textContent = `${objPM.content}` || ''
    let messageTime = document.createElement("span")
    messageTime.textContent = `${objPM.date}` || ''
    let messageAuth = document.createElement("span")
    messageAuth.textContent = `${objPM.auth}`
    
    if (objPM.user_from === userClient.Id) {
        divMessage.classList.add('msgEnvoi')
    } else {
        divMessage.classList.add('msgReçu')
    }

    divMessage.appendChild(messageContent)
    divMessage.appendChild(messageAuth)
    divMessage.appendChild(messageTime)
    source.appendChild(divMessage)
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
function throttlePM(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
}
// function handling down scroll, and start new batch fetch of older pm
function handleScrollPM(userClient, userTo, chatContent) {
    if (chatContent.scrollTop < 100 && !isLoading) {
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