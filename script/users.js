import { openChatBox } from "./chat.js"

function dateConvertor(timestamp) {
    const date = new Date(timestamp);
    
    const pad = (num) => (num < 10 ? '0' + num : num);
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // Les mois commencent à 0
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

export function sortUser(allUsers, onlineUsers, pmClient, currentClient) {
    let offlineUsers = allUsers.filter(user => !onlineUsers.some(onlineUser => onlineUser.Id === user.Id))
    onlineUsers = onlineUsers.filter(user => user.Id !== currentClient.Id)
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
    
    let lastDate = undefined
    if (pmIndexUser.length !== 0) {
        lastDate = pmIndexUser[0].Date
    }

    const userDiv = document.createElement("div")
    userDiv.id = `user-${userTo.Id}`

    const usernameDiv = document.createElement("div")
    const usernameText = document.createElement("span")
    usernameText.textContent = userTo.Nickname
    usernameDiv.appendChild(usernameText)

    if (lastDate) {
        const lastMessageDiv = document.createElement("div")
        const lastMessageLabel = document.createElement("span")
        lastMessageLabel.textContent = "Last contact: "
        const lastMessageText = document.createElement("span")
        
        // Formate la date avec dateConvertor
        lastMessageText.textContent = dateConvertor(lastDate) || ""
        lastMessageDiv.appendChild(lastMessageLabel)
        lastMessageDiv.appendChild(lastMessageText)
        userDiv.appendChild(lastMessageDiv)
    }
   
    userDiv.prepend(usernameDiv)

    if (online) {
        const chatButton = document.createElement("button")
        const imgButton = document.createElement("img")
        imgButton.classList.add("picMessage")
        imgButton.setAttribute("src", "./pics/logo.svg")
        chatButton.appendChild(imgButton)
        chatButton.onclick = () => {
            const existingChatBox = document.getElementById(`chat-${userTo.Id}`)
            if (existingChatBox) {
                existingChatBox.remove() 
            } else {
                openChatBox(userTo, conn, userClient)
            }
        }
        userDiv.appendChild(chatButton)
    }   

    return userDiv
}