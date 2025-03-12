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

window.onload = function () {
    let conn;
    console.log(document.location);
  
    // Création de la connexion WebSocket côté client
    if (window["WebSocket"]) {
      conn = new WebSocket("ws://" + document.location.host + "/ws");
      const output = document.querySelector("#output");
  
      conn.onopen = function (e) {
        output.textContent = "connection successful";
      };
  
      conn.onclose = function (e) {
        console.log("Closed WS");
      };
  
      conn.onerror = function (e) {
        output.textContent = "error: " + e.data;
      };
  
      conn.onmessage = function (e) {
        output.textContent = "received: " + e.data;
      };
    } else {
      console.log("Your browser does not support WebSockets");
    }
  
    // Gestion du bouton de test WebSocket
    document.getElementById("testbutWS").onclick = function (e) {
      const textInput = document.querySelector("#testWS").value;
      console.log(textInput);
      if (conn) {
        conn.send(textInput);
      }
    };
  
    // --- Logiques de changement d'affichage via les boutons tests ---
  
    const testButtons = document.querySelectorAll('[data-test="true"]');
  
    // Bouton 1 : bascule la visibilité du header
    if (testButtons[0]) {
      testButtons[0].addEventListener('click', () => {
        const header = document.querySelector('header');
        header.dataset.visible = header.dataset.visible === "true" ? "false" : "true";
      });
    }
  
    // Bouton 2 : bascule la visibilité de la sidebar
    if (testButtons[1]) {
      testButtons[1].addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        sidebar.dataset.visible = sidebar.dataset.visible === "true" ? "false" : "true";
      });
    }
  
    // Bouton 3 : alterne entre l'affichage des sujets et celui du bloc Post/Comment
    if (testButtons[2]) {
      testButtons[2].addEventListener('click', () => {
        const header = document.querySelector('header');
        const navElement = document.querySelector('nav');
        const sidebar = document.querySelector('.sidebar');
        // Restaure la visibilité des éléments du forum
        header.dataset.visible = "true";
        navElement.dataset.visible = "true";
        sidebar.dataset.visible = "true";
  
        const gridItems = document.querySelectorAll('.grid-item');
        const postBlock = document.querySelector('.post');
        const commentBlock = document.querySelector('.comment');
        const authContainer = document.querySelector('.auth-container');
        // Masque toujours l'authentification
        authContainer.dataset.visible = "false";
  
        // Bascule l'affichage des sujets et du bloc Post/Comment
        if (gridItems[0].dataset.visible === "true") {
          gridItems.forEach(item => item.dataset.visible = "false");
          postBlock.dataset.visible = "true";
          commentBlock.dataset.visible = "true";
        } else {
          gridItems.forEach(item => item.dataset.visible = "true");
          postBlock.dataset.visible = "false";
          commentBlock.dataset.visible = "false";
        }
      });
    }
  
    // Bouton 4 : bascule la visibilité de la vue Authentification et des éléments du forum
    if (testButtons[3]) {
      testButtons[3].addEventListener('click', () => {
        const authContainer = document.querySelector('.auth-container');
        const navElement = document.querySelector('nav');
        const sidebarElement = document.querySelector('.sidebar');
        const gridItems = document.querySelectorAll('.grid-item');
        const postBlock = document.querySelector('.post');
        const commentBlock = document.querySelector('.comment');
  
        if (authContainer.dataset.visible === "true") {
          // Masquer l'authentification et réafficher le forum
          authContainer.dataset.visible = "false";
          navElement.dataset.visible = "true";
          sidebarElement.dataset.visible = "true";
          gridItems.forEach(item => item.dataset.visible = "true");
          postBlock.dataset.visible = "false";
          commentBlock.dataset.visible = "false";
        } else {
          // Afficher l'authentification et masquer le forum
          authContainer.dataset.visible = "true";
          navElement.dataset.visible = "false";
          sidebarElement.dataset.visible = "false";
          gridItems.forEach(item => item.dataset.visible = "false");
          postBlock.dataset.visible = "false";
          commentBlock.dataset.visible = "false";
        }
      });
    }
  
    // --- Fonctionnalité sur le bouton d'authentification (Register) ---
    const registerBtn = document.querySelector('.register-btn');
    if (registerBtn) {
      registerBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Empêche le comportement par défaut
  
        // Récupération des valeurs du formulaire d'authentification
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const nickname = document.getElementById('nickname').value;
        const age = parseInt(document.getElementById('age').value, 10);
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
  
        // Récupération et conversion du genre via le bouton radio sélectionné
        let gender = 0;
        const genderInput = document.querySelector('input[name="gender"]:checked');
        if (genderInput) {
          gender = (genderInput.value === "male") ? 1 : 2;
        }
  
        // Construction de l'objet JSON
        const data = {
          nickname: nickname,
          first_name: firstName,
          last_name: lastName,
          age: age,
          gender: gender,
          email: email,
          password: password,
          method: "InsertUser"
        };
  
        console.log("JSON généré :", JSON.stringify(data));
        if (conn) {
          conn.send(JSON.stringify(data));
        }
      });
    }
  };
  
