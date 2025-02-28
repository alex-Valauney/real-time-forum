export function init() {
    window.onload = function () { //Launched when window is loading
        let conn
        console.log(document.location)

        //Creating the front websocket connection 
        if (window["WebSocket"]) {
            conn = new WebSocket("ws://" + document.location.host + "/ws")
            let output = document.querySelector("#output")
            conn.onopen = function (e) {
                output.textContent = "connection successful"
            }
            conn.onclose = function (e) { //Display that the user was disconnected of the ws 
                console.log("Closed WS")
            }
            conn.onerror = function (e) {
                output.textContent = "error : " + e.data
            }
            conn.onmessage = function (e) { //Will be splitted in further cases depending on the nature of the message
                output.textContent = "received : " + e.data
            }
        } else {
            console.log("Your browser does not support WebSockets")
        }
        document.getElementById("testbutWS").onclick = function (e) {
            let textinputdata = document.querySelector("#testWS").value
            console.log(textinputdata)
            conn.send(textinputdata)
        }
        handleForms(conn) //Getting forms and using the ws
    }
    onClicksFunctions()
}

function handleForms(conn) {
    //All forms got by id
    let registerForm = document.getElementById("registerForm")
    registerForm.onsubmit = function (e) {
        onSubForm(e, registerForm) //manque method
    }
    let loginForm = document.getElementById("loginForm")
    loginForm.onsubmit = function (e) {
        onSubForm(e, loginForm) //manque method
    }
    let postForm = document.getElementById("postForm")
    loginForm.onsubmit = function (e) {
        onSubForm(e, loginForm) //manque method
    }
    let commentForm = document.getElementById("commentForm")
    loginForm.onsubmit = function (e) {
        onSubForm(e, loginForm) //manque method
    }
    //Local function putting in object shape forms to pass through the ws
    function onSubForm (e, form, method) {
        let formData = {}
        e.preventDefault()
        let fields = form.querySelectorAll("input")

        fields.forEach(field => {
            if (field.type === "radio") {
                if (field.checked) {
                    formData[field.name] = field.value
                }
            } else if (field.type !== "submit") {
                formData[field.name] = field.value
            }
        })
        formData["method"] = method

        console.log(JSON.stringify(formData)) //Checking for us if everything's working fine, will be deleted later
        if (!conn) {
            return false
        }
        conn.send(JSON.stringify(formData)) //Only strings, blobs, ArrayBuffers are accepted to be sent
        return false
    }
}

//Events that will used with onLoadPage() to switch sections
function onClicksFunctions() {
    onLoadPage('register') //If unlogged, display register section, by default
    let currentLoad = document.body.querySelector('section:not(.hidden)')

    document.getElementById('linkLogin').onclick = function (e) {
        onLoadPage('login', currentLoad.id)
        currentLoad = document.body.querySelector('section:not(.hidden)')
    }

    document.getElementById('linkRegister').onclick = function (e) { 
        onLoadPage('register', currentLoad.id)
        currentLoad = document.body.querySelector('section:not(.hidden)')
    }
}

//Switching classes on sections to hide/display what we want
function onLoadPage(newSection, oldSection) {
    document.getElementById(newSection).classList.remove('hidden')
    if (oldSection) {
        document.getElementById(oldSection).classList.add('hidden')
    }
}

