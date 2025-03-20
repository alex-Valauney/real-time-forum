export function sortUser(allUsers, onlineUsers, pmClient, currentClient) {
    let offlineUsers = allUsers.filter(user => !onlineUsers.includes(user))
    onlineUsers = onlineUsers.filter(user => user.Id !== currentClient)
    onlineUsers.sort((a, b) => sortByPm(a, b, pmClient))
    offlineUsers.sort((a, b) => sortByPm(a, b, pmClient))

    addUserElem(onlineUsers, true, pmClient)
    addUserElem(offlineUsers, false, pmClient)
}

function sortByPm(userA, userB, pmClient) {
    const inPmA = pmClient.includes(userA.Id)
    const inPmB = pmClient.includes(userB.Id)

    if (inPmA && !inPmB) {
        return -1
    }
    if (!inPmA && inPmB) {
        return 1
    }
    if (inPmA && inPmB) {
        return pmClient.indexOf(userA.Id) - pmClient.indexOf(userB.Id)
    }

    return userA.User_nickname.localeCompare(userB.User_nickname)
}

function addUserElem(tabUser, online, pmClient) {
    const userListOn = document.getElementById("onlineUser")
    const userListOff = document.getElementById("offlineUser")
    tabUser.forEach(user => {
        let userDiv = createUserElem(user, online, pmClient)
        if (online) {
            userListOn.appendChild(userDiv)
        } else {
            userListOff.appendChild(userDiv)
        }
    })
    attachPostClickEvents()
}

function createUserElem(user, online, pmClient) {
    let pmIndexUser = pmClient.filter(pm => user.Id === pm.User_from || user.Id === pm.User_to)
    let lastDate
    if (pmIndexUser) {
        lastDate = pmIndexUser[0].Date
    }

    const userDiv = document.createElement("div")

    const usernameDiv = document.createElement("div")
    const usernameText = document.createElement("span")
    usernameText.textContent = user.User_nickname
    usernameDiv.appendChild(usernameText)

    const lastMessageDiv = document.createElement("div")
    const lastMessageLabel = document.createElement("span")
    lastMessageLabel.textContent = "Last contact: "
    const lastMessageText = document.createElement("span")
    lastMessageText.textContent = lastDate ? lastDate : ""
    lastMessageDiv.appendChild(lastMessageLabel)
    lastMessageDiv.appendChild(lastMessageText)
   
    userDiv.appendChild(usernameDiv)
    userDiv.appendChild(lastMessageDiv)

    if (online) {
        const chatButton = document.createElement("button")
        const imgButton = document.createElement("img")
        imgButton.setAttribute("src", "./pics/logo.svg")
        imgButton.setAttribute("src", "./pics/logo.svg")
        chatButton.appendChild(imgButton)
        chatButton.onclick = () => openChatBox(user)
        userDiv.appendChild(chatButton)
    }   

    return userDiv
}

export function openChatBox(userTo) {
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
            let msgDiv = document.createElement("div")
            msgDiv.textContent = message
            chatContent.appendChild(msgDiv)
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