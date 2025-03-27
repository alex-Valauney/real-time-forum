import { addNewPosts, addScrollPosts } from './post.js'
import { addNewCom } from './comment.js'

export async function getUser() { //get all user details from id
    try {
        let response = await fetch('/user', {
            method: "GET"
        })
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération de l'utilisateur")
        }
        return await response.json()
    } catch (error) {
        console.error("Erreur :", error)
    }
}

export async function getLastPMList(user) { //get all user's last mps and then sort them for the list 
    try {
        let response = await fetch(`/pm?id=${user}`, {
            method: "GET"
        })

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des posts");
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
    return await response.json()
}

export async function getSpePM(userClient) { //get all user's last mps and then sort them for the list 
    try {
        let response = await fetch(`/spepm?idclient=${userClient}&idto=${userTo}`, {
            method: "GET"
        })

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des posts");
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
    return await response.json()
}

// Partie index

export async function scrollPosts() {
    let allRow = Array.from(document.querySelectorAll('tr')).filter(tr => !tr.getAttribute("id"))
    try {
        let response 
        if (allRow.length === 0) {
            response = await fetch(`/nextPosts`)
        } else {
            response = await fetch(`/nextPosts?id=${postIdFromTr(allRow.at(-1))}`, {
                method: "GET"
            })
        }
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des posts");
    }
    const posts = await response.json()
    addScrollPosts(posts)
    } catch (error) {
        console.error("Erreur :", error);
    }
}

export async function refreshPosts() {
    let allRow = Array.from(document.querySelectorAll('tr')).filter(tr => !tr.getAttribute("id"))
    try {
        const response = await fetch(`/refreshPosts?id=${postIdFromTr(allRow[0])}`, {
            method: "GET"
        })
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des posts")
        }
        const posts = await response.json()
        addNewPosts(posts)
    } catch (error) {
        console.error("Erreur :", error);
    }
}

function postIdFromTr(tr) {
    return Array.from(tr.children)[0].id
}

export async function getOnePost(id) {
    try {
        const response = await fetch(`/getPost?id=${id}`, {
            method: "GET"
        })
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des posts");
        }
        const postData = await response.json()
        return postData
    } catch (error) {
        console.error("Erreur :", error);
    }
}

//
export async function getComs(idPost) {
    let allCom = Array.from(document.querySelectorAll('li'))
    try {
        let response
        if (allCom.length === 0) {
            response = await fetch(`/nextComs?idPost=${idPost}`, {
                method: "GET"
            })
        } else {
            response = await fetch(`/nextComs?idCom=${allCom.at(-1).id}&idPost=${idPost}`, {
                method: "GET"
            });
        }
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des posts");
        }
        const comments = await response.json();
        addNewCom(comments);
    } catch (error) {
        console.error("Erreur :", error);
    }
}

