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

function addNewCom(tabCom) {
    let comList = document.getElementById("commentList");
    console.log(tabCom)
    tabCom.forEach(com => {
        let comItem = createComElem(com);
        comList.appendChild(comItem);
    })
}

function createComElem(com) {
    const li = document.createElement("li");
    li.setAttribute("id", `com-${com.Id}`);

    const article = document.createElement("article");

    // Créer et configurer l'élément h3 pour l'auteur
    const h3 = document.createElement("h3");
    h3.textContent = com.User_nickname || "Auteur inconnu";

    // Créer et configurer l'élément p pour le contenu
    const p = document.createElement("p");
    p.textContent = com.Content || "Contenu manquant";

    // Créer et configurer l'élément time pour la date
    const time = document.createElement("time");
    time.setAttribute("datetime", com.Date || '');
    time.textContent = com.Date || '';

    // Assembler les éléments
    article.appendChild(h3);
    article.appendChild(p);
    article.appendChild(time);
    li.appendChild(article);

    return li;
}

