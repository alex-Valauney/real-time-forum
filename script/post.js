export async function getPosts() {
    try {
        const response = await fetch("/transferPost");
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des posts");
        }
        const posts = await response.json()
        displayLastPosts(posts)
    } catch (error) {
        console.error("Erreur :", error);
    }
}

export function displayLastPosts(tabPost) {
    console.log(tabPost)
    const indexSection = document.getElementById("indexTable")
    indexSection.replaceChildren()

    tabPost.forEach(post => {
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
        indexSection.prepend(postLine)
    })
}

/* tabPost.forEach(post => {
    const lineButton = document.createElement("button")
    postButton.classList.add("grid-item")
    postButton.setAttribute("id",`${post.Id}`)
    postButton.innerText = `${post.Title}` + '\n' + `${post.Content}`
    indexSection.prepend(postButton)
}) */