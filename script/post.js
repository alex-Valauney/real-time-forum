import { attachPostClickEvents } from "./main.js";


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

function addNewPosts(tabPost) {
    const indexSection = document.getElementById("indexTable")
    tabPost.forEach(post => {
        let postLine = createPostElem(post)
        indexSection.prepend(postLine)
    })
    attachPostClickEvents()
}

function addScrollPosts(tabPost) {
    const indexSection = document.getElementById("indexTable")
    tabPost.forEach(post => {
        let postLine = createPostElem(post)
        indexSection.appendChild(postLine)
    })
    attachPostClickEvents()
}

function createPostElem(post) {
    const postLine = document.createElement("tr")
    const postCell1 = document.createElement("td")
    const postCell2 = document.createElement("td")
    const postCell3 = document.createElement("td")
    const postTitle = document.createElement("a")  
    const postDate = document.createElement("p") 
    const postAuthor = document.createElement("p")
    const postNbCom = document.createElement("p")
    postCell1.setAttribute("id", `post-${post.Id}`)
    postCell2.setAttribute("id", `postAuth-${post.User_nickname}`)
    postCell3.setAttribute("id", `postStats-${post.Comment_count}`)
    postTitle.innerText = `${post.Title}`
    postTitle.setAttribute("postId", `post-${post.Id}`)
    postDate.innerText = `${post.Date}`
    postAuthor.innerText = `${post.Author}`
    postNbCom.textContent = `${post.Comment} Comments`
    postCell1.appendChild(postTitle)
    postCell2.appendChild(postAuthor)
    postCell3.appendChild(postNbCom)
    postLine.appendChild(postCell1)
    postLine.appendChild(postCell2)
    postLine.appendChild(postCell3)
    return postLine
}

let isLoading = false

// basic throttle to avoid lodash import
export function throttlePost(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// function handling down scroll, and start new batch fetch of older posts
export function handleScrollPost() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.body.offsetHeight;
    if (scrollPosition >= pageHeight - 100 && !isLoading) {
        isLoading = true;
        scrollPosts().finally(() => {
            isLoading = false;
        });
    }
}

async function getOnePost(id) {
    try {
        let response = await fetch(`/getPost?id=${id}`)
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des posts");
        }
        const postData = await response.json()
        return postData
    } catch (error) {
        console.error("Erreur :", error);
    }
}

export function buildPostPage(postId) {
    const data = getOnePost(postId)
    const postSection = document.getElementById("post")

    const article = document.createElement("article")
    article.setAttribute("id", "postArticle")
    article.classList.add("post")

    const header = document.createElement("header")
    const h2 = document.createElement("h2")
    h2.textContent = data.Title || "Auteur inconnu"

    const p1 = document.createElement("p")
    p1.textContent = data.Content || "Contenu manquant"

    const footer = document.createElement("footer")
    const p2 = document.createElement("p")
    const strong = document.createElement("strong")
    const time = document.createElement("time")
    strong.textContent = `${data.User_nickname}`
    time.textContent = `${data.Date}`
    time.setAttribute("datetime", `${data.Date}`)

    article.appendChild(header)
    header.appendChild(h2)
    article.appendChild(p1)
    article.appendChild(footer)
    footer.appendChild(p2)
    p2.appendChild(document.createTextNode("Posted by "))
    p2.appendChild(strong)
    p2.appendChild(document.createTextNode(" | "))
    p2.appendChild(time)
    
    postSection.prepend(article)

    const form = document.getElementById("newComForm")
    form.setAttribute("action", `/newCom?id=${postId}`)
}