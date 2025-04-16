import { openChatBox } from "./chat.js"

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

    console.log(lastDate)

    const userDiv = document.createElement("div")
    userDiv.id = `user-${userTo.Id}`
    userDiv.classList.add('UserDiv')

    const usernameDiv = document.createElement("div")
    const usernameText = document.createElement("span")
    usernameText.textContent = userTo.Nickname
    usernameDiv.appendChild(usernameText)
    
    const lastMessageDiv = document.createElement("div")
    const lastMessageLabel = document.createElement("span")
    lastMessageDiv.classList.add("test")
    lastMessageLabel.textContent = "Last contact:"
    const lastMessageText = document.createElement("span")

    lastMessageText.textContent = "\n"

    lastMessageText.textContent = ecartTemps((lastDate)) || ""

    lastMessageDiv.appendChild(lastMessageLabel)
    lastMessageDiv.appendChild(lastMessageText)
    userDiv.appendChild(lastMessageDiv)
   
    userDiv.prepend(usernameDiv)

    if (online) {
        userDiv.addEventListener("click", function(){
            const existingChatBox = document.getElementById(`chat-${userTo.Id}`)
        if (existingChatBox) {
            existingChatBox.remove() 
        } else {
            openChatBox(userTo, conn, userClient)
        }});

    }   

    return userDiv
}
function ecartTemps(dateStosk) {

    console.log('ecartTemps')
    
    const maintenan = new Date(Date.now())
    const avant = new Date(dateStosk)

    console.log(maintenan)
    console.log(avant)
    
    var diff = {}							// Initialisation du retour
    var tmp = maintenan - avant;

    tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;					// Extraction du nombre de secondes

    tmp = Math.floor((tmp-diff.sec)/60);	// Nombre de minutes (partie entière)
    diff.min = tmp % 60;					// Extraction du nombre de minutes

    tmp = Math.floor((tmp-diff.min)/60);	// Nombre d'heures (entières)
    diff.hour = tmp % 24;					// Extraction du nombre d'heures
    
    tmp = Math.floor((tmp-diff.hour)/24);	// Nombre de jours restants
    diff.day = tmp;

    if (diff.sec > 1) {
        if (diff.min > 1) {
            if (diff.hour > 1) {
                if (diff.day > 1) {
                    return diff.day + ' Days'
                }
                console.log('pomme')
                return diff.hour + ' hours'
            }
            console.log('poire')
            return diff.min + ' min'
        }
        console.log('banane')
        return diff.sec + ' sec'
    }
}
