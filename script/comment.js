export async function getComs() {
    let allCom = Array.from(document.querySelectorAll('article'))
    try {
        let response
        if (allCom.length === 0) {
            response = await fetch(`/nextComs?idPost=${1}`, {
                method: "GET"
            })
        } else {
            response = await fetch(`/nextComs?idCom=${allCom.at(-1).id}&idPost=${1}`, { //CEST PAS 1 FAUT METTRE LA BONNE VARIABLE
                method: "GET"
            })
        }
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des posts")
        }
        const comments = await response.json()
        addNewCom(comments)
    } catch (error) {
        console.error("Erreur :", error);
    }
}

function addNewCom(tabCom) {
    let comList = document.getElementById("commentList")

    tabCom.forEach(com => {
        let comArticle = createComElem(com)
        comList.appendChild(comArticle)
    })
}

function createComElem(com) { // DJIMI PUTEH
    const comCont = document.createElement("article")
    comCont.setAttribute("id", `${com.Id}`)

    return comArticle
}