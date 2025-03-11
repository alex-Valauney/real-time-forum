// script/script.js

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
  
    // Bouton 3 : bascule entre l'affichage des sujets et celui du bloc Post/Comment
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
          // Si l'authentification est visible, on la masque et on réaffiche le forum
          authContainer.dataset.visible = "false";
          navElement.dataset.visible = "true";
          sidebarElement.dataset.visible = "true";
          gridItems.forEach(item => item.dataset.visible = "true");
          postBlock.dataset.visible = "false";
          commentBlock.dataset.visible = "false";
        } else {
          // Sinon, on affiche l'authentification et on masque le forum
          authContainer.dataset.visible = "true";
          navElement.dataset.visible = "false";
          sidebarElement.dataset.visible = "false";
          gridItems.forEach(item => item.dataset.visible = "false");
          postBlock.dataset.visible = "false";
          commentBlock.dataset.visible = "false";
        }
      });
    }
  };
  