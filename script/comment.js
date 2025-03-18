export async function getComs() {
    let allCom = Array.from(document.querySelectorAll('#commentList li'));
    try {
        let response;
        if (allCom.length === 0) {
            response = await fetch(`/nextComs`);
        } else {
            response = await fetch(`/nextComs?idCom=${allCom.at(-1).id}&idPost=${1}`, {
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

function addNewCom(tabCom) {
    let comList = document.getElementById("commentList");

    tabCom.forEach(com => {
        let comItem = createComElem(com);
        comList.appendChild(comItem);
    });
}

function createComElem(com) {
    const li = document.createElement("li");
    li.setAttribute("id", `com-${com.Id}`);

    const article = document.createElement("article");
    article.innerHTML = `
        <h3>${com.author || "Auteur inconnu"}</h3>
        <p>${com.content || "Contenu manquant"}</p>
        <time datetime="${com.date || ''}">${com.date || ''}</time>
    `;
    li.appendChild(article);

    return li;
}
