export function init() {
    window.onload = function () {
        let conn;
        
        if (window["WebSocket"]) {
            conn = new WebSocket(document.location.origin);
            conn.onclose = function (evt) {
                console.log("Closed WS")
            };
            conn.onmessage = function (evt) {
                console.log(evt.data)
            };
        } else {
            console.log("Your browser does not support WebSockets")
        }
        
        handleForms(conn)
    }
    onClicksFunctions()
}

function handleForms(conn) {
    
    let registerForm = document.getElementById("registerForm")
    registerForm.onsubmit = function (e) {
        onSubForm(e, registerForm)
    }
    let loginForm = document.getElementById("loginForm")
    loginForm.onsubmit = function (e) {
        onSubForm(e, loginForm)
    }
    let postForm = document.getElementById("postForm")
    loginForm.onsubmit = function (e) {
        onSubForm(e, loginForm)
    }
    let commentForm = document.getElementById("commentForm")
    loginForm.onsubmit = function (e) {
        onSubForm(e, loginForm)
    }
    
    function onSubForm (e, form) {
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
        console.log(JSON.stringify(formData))
        if (!conn) {
            return false
        }
        conn.send(JSON.stringify(formData))
        return false
    }
}


function onClicksFunctions() {
    onLoadPage('register')
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

function onLoadPage(newSection, oldSection) {
    document.getElementById(newSection).classList.remove('hidden')
    if (oldSection) {
        document.getElementById(oldSection).classList.add('hidden')
    }
}

