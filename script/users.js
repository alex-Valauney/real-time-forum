export function sortUser(allUsers, onlineUsers, pmClient, currentClient) {
    let offlineUsers = allUsers.filter(user => !onlineUsers.includes(user))
    onlineUsers = onlineUsers.filter(user => user.Id !== currentClient)
    onlineUsers.sort((a, b) => sortByPm(a, b, pmClient))
    offlineUsers.sort((a, b) => sortByPm(a, b, pmClient))

    return {online: onlineUsers, offline: offlineUsers}
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

    return userA.Nickname.localeCompare(userB.Nickname)
}

export function addUserElem(tabUser, online, pmClient, conn, userClient) {
    const userListOn = document.getElementById("onlineUser")
    const userListOff = document.getElementById("offlineUser")
    tabUser.forEach(user => {
        let userDiv = createUserElem(user, online, pmClient, conn, userClient)
        if (online) {
            userListOn.appendChild(userDiv)
        } else {
            userListOff.appendChild(userDiv)
        }
    })
}

function createUserElem(userTo, online, pmClient, conn, userClient) {
    let pmIndexUser = pmClient.filter(pm => userTo.Id === pm.User_from || userTo.Id === pm.User_to)
    let lastDate
    if (pmIndexUser.length != 0) {
        lastDate = pmIndexUser[0].Date
    }

    const userDiv = document.createElement("div")

    const usernameDiv = document.createElement("div")
    const usernameText = document.createElement("span")
    usernameText.textContent = userTo.Nickname
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
        chatButton.appendChild(imgButton)
        chatButton.onclick = () => openChatBox(userTo, conn, userClient)
        userDiv.appendChild(chatButton)
    }   

    return userDiv
}