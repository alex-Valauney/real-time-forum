export function addNewCom(tabCom) {
    let comList = document.getElementById("commentList");
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

