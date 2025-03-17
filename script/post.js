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
    let indexSection = document.getElementById("indexTable")
    indexSection.replaceChildren()

    tabPost.forEach(post => {
        const postLine = document.createElement("tr")
        const postCell1 = document.createElement("td")
        postCell1.setAttribute("id", 'post-'+`${post.Id}`)
        const postTitle = document.createElement("a")
        postTitle.innerText = `${post.Title}`
        const postCell2 = document.createElement("td")
        postCell2.setAttribute("id", 'postStats-'+`${post.Id}`)
        const postNbCom = document.createElement("span")
        postNbCom.innerText = `${post.Id}`+'Comments' //Mettre le nb de comment au lieu de l'id
    })
}

/* tabPost.forEach(post => {
    const lineButton = document.createElement("button")
    postButton.classList.add("grid-item")
    postButton.setAttribute("id",`${post.Id}`)
    postButton.innerText = `${post.Title}` + '\n' + `${post.Content}`
    indexSection.prepend(postButton)
}) */