export async function scrollPosts() {
    let allRow = Array.from(document.querySelectorAll('tr')).filter(tr => !tr.getAttribute("id"))
    try {
        let response 
        if (1) {
            response = await fetch(`/nextPosts`)
        } else {
            response = await fetch(`/nextPosts?id=${postIdFromTr(allRow[-1])}`, {
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
}

function addScrollPosts(tabPost) {
    const indexSection = document.getElementById("indexTable")
    tabPost.forEach(post => {
        let postLine = createPostElem(post)
        indexSection.appendChild(postLine)
    })
}

export function createPostElem(tabPost) {
    const postLine = document.createElement("tr")
    const postCell1 = document.createElement("td")
    const postCell2 = document.createElement("td")
    const postCell3 = document.createElement("td")
    const postTitle = document.createElement("a")   
    const postAuthor = document.createElement("p")
    const postNbCom = document.createElement("p")
    postCell1.setAttribute("id", `post-${post.Id}`)
    postCell2.setAttribute("id", `postAuth-${post.Id}`)
    postCell3.setAttribute("id", `postStats-${post.Id}`)
    postTitle.innerText = `${post.Title}`
    postAuthor.innerText = `${post.Author}` // Mettre le nom de l'auteur
    postNbCom.textContent = `${post.Comment} Comments` //Mettre le nb de comment au lieu de l'id
    postCell1.appendChild(postTitle)
    postCell2.appendChild(postAuthor)
    postCell3.appendChild(postNbCom)
    postLine.appendChild(postCell1)
    postLine.appendChild(postCell2)
    postLine.appendChild(postCell3)
}


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