import { connWebSocket } from "./websocket.js"
import { throttlePost, handleScrollPost, buildPostPage } from "./post.js"
import { openChatBox } from "./chat.js"
import { getUser, refreshPosts, scrollPosts } from "./fetches.js"

let currentLoadId = sessionStorage.getItem("currentLoadId") || undefined
let currentPost = sessionStorage.getItem("currentPost") ? parseInt(sessionStorage.getItem("currentPost")) : undefined
let currentLoad = currentLoadId ? document.getElementById(currentLoadId) : undefined

export function init() {

  window.onload = async function () {//Launched when window is loading
    let isLoggedIn = await checkSession()
    if (isLoggedIn) {
      if (!currentLoad || !document.getElementById(currentLoadId)) {
        currentLoadId = "index"
        onLoadPage('index')
        currentLoad = document.body.querySelector('section:not(.hidden)')
      } else {
        onLoadPage(currentLoad.id, undefined, currentPost)
        currentLoad = document.body.querySelector('section:not(.hidden)')
      }
      window.addEventListener("scroll", throttlePost(handleScrollPost, 200))
      scrollPosts()
      setInterval(refreshPosts, 10000)

      let userClient = await getUser()
      connWebSocket(userClient)
    } else {
      if (!currentLoad || !document.getElementById(currentLoadId)) {
        currentLoad = "login"
        onLoadPage('login') //If unlogged, display login section, by default
        currentLoad = document.body.querySelector('section:not(.hidden)')
      } else {
        onLoadPage(currentLoad.id)
        currentLoad = document.body.querySelector('section:not(.hidden)')
      }
    }
    saveState()
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
      saveState()
    }
  }
  if (document.getElementById('linkRegister')) {
    document.getElementById('linkRegister').onclick = function (e) { 
      onLoadPage('register', currentLoad.id)
      currentLoad = document.body.querySelector('section:not(.hidden)')
      saveState()
    }
  }
  if (document.getElementById('homeButton')) {
    document.getElementById('homeButton').onclick = function (e) {
      if (currentLoad.id !== 'index') {
        onLoadPage('index', currentLoad.id)
        currentLoad = document.body.querySelector('section:not(.hidden)')
        saveState()
      }
    }
  }
  if (document.getElementById('newPostButton')) {
    document.getElementById('newPostButton').onclick = function (e) { 
      if (currentLoad.id !== 'newPost') {
        onLoadPage('newPost', currentLoad.id)
        currentLoad = document.body.querySelector('section:not(.hidden)')
        saveState()
      }
    }
  }
  if (document.getElementById('postButton')) {
    document.getElementById('postButton').onclick = function (e) {
      if (currentLoad.id !== 'post') {
        onLoadPage('post', currentLoad.id)
        currentLoad = document.body.querySelector('section:not(.hidden)')
        saveState()
      }
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
        openChatBox()
      } else {
        onLoadPage(undefined, 'chat')
      }
    }
  }
}
export function attachPostClickEvents() {
  const table = document.getElementById("indexTable")
  Array.from(table.querySelectorAll("a")).forEach(link => {
      link.onclick = function(e) {
        e.preventDefault()
        const postId = parseInt(link.getAttribute("postId").split('-')[1])
        onLoadPage('post', currentLoad.id)
        currentLoad = document.body.querySelector('section:not(.hidden)')
        currentPost = postId
        saveState()
        buildPostPage(postId)
      }
  })
}

//Switching classes on sections to hide/display what we want
function onLoadPage(newSection, oldSection, postId = undefined) {
  if (newSection) {
    document.getElementById(newSection).classList.remove('hidden')
    if (postId) {
      buildPostPage(postId)
    }
  }
  if (oldSection) {
    document.getElementById(oldSection).classList.add('hidden')
    if (oldSection === "post") {
      const postArticle = document.getElementById("postArticle")
      postArticle.remove()
      const comList = document.getElementById("commentList")
      comList.replaceChildren()
    }
  }
}

function saveState() {
  sessionStorage.setItem("currentLoadId", currentLoad ? currentLoad.id : "");
  sessionStorage.setItem("currentPost", currentPost !== undefined ? currentPost.toString() : "")
}

export function debounce(func, delay = 0) {
  let timer
  return function(...args) {
      clearTimeout(timer) 
      timer = setTimeout(() => {func.apply(this, args)}, delay)
  }
}