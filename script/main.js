import { connWebSocket } from "./websocket.js"
import { getPosts } from "./post.js"

let currentLoad

export function init() {
  window.onload = async function () {//Launched when window is loading
    let isLoggedIn = await checkSession();
    if (isLoggedIn) {
      onLoadPage('index')
      currentLoad = document.body.querySelector('section:not(.hidden)')
      getPosts()
      setInterval(getPosts, 10000)
      connWebSocket()
    } else {
      onLoadPage('register') //If unlogged, display register section, by default
      currentLoad = document.body.querySelector('section:not(.hidden)')
    }
  }
  onClicksFunctions()
}

async function checkSession() {
  try {
    let response = await fetch("/checkSession", { 
      method: "GET",
      credentials: "include"
    })

    if (!response.ok) {
      return false
      return false
    }

    let data = await response.json()
    return data.status === "authenticated"

  } catch (error) {
    console.error("Erreur lors de la vérification de session:", error)
    return false
  }
}

//Events that will used with onLoadPage() to switch sections
function onClicksFunctions() {
  if (document.getElementById('linkLogin')) {
    document.getElementById('linkLogin').onclick = function (e) {
      onLoadPage('login', currentLoad.id)
      currentLoad = document.body.querySelector('section:not(.hidden)')
    }
  }
  if (document.getElementById('linkRegister')) {
  }
  if (document.getElementById('linkRegister')) {
    document.getElementById('linkRegister').onclick = function (e) { 
      onLoadPage('register', currentLoad.id)
      currentLoad = document.body.querySelector('section:not(.hidden)')
    }
  }
  if (document.getElementById('homeButton')) {
    document.getElementById('homeButton').onclick = function (e) { 
      onLoadPage('index', currentLoad.id)
      currentLoad = document.body.querySelector('section:not(.hidden)')
    }
  }
  if (document.getElementById('newPostButton')) {
    document.getElementById('newPostButton').onclick = function (e) { 
      onLoadPage('newPost', currentLoad.id)
      currentLoad = document.body.querySelector('section:not(.hidden)')
    }
  }
  if (document.getElementById('postButton')) {
    document.getElementById('postButton').onclick = function (e) { 
      onLoadPage('post', currentLoad.id)
      currentLoad = document.body.querySelector('section:not(.hidden)')
    }
  }
  if (document.getElementById('logoutButton')) {
    document.getElementById('logoutButton').onclick = function (e) {
      window.location.replace("/logout")
    }
  }
  if (document.getElementById('chatButton')) {
    document.getElementById('chatButton').onclick = function (e) {
      if (document.getElementById('chat').classList.contains('hidden')) {
        onLoadPage('chat')
      } else {
        onLoadPage(undefined, 'chat')
      }
    }
  }
}

//Switching classes on sections to hide/display what we want
function onLoadPage(newSection, oldSection) {
  if (newSection) {
    document.getElementById(newSection).classList.remove('hidden')
  }
  if (oldSection) {
    document.getElementById(oldSection).classList.add('hidden')
  }
}


/*     // --- Logiques de changement d'affichage via les boutons tests ---
  

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
    } */

