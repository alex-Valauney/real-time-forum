package main

import (
	"net/http"
	"real-time-forum/methods"
)

func DetailPost(w http.ResponseWriter, r *http.Request) {

}

func NewPost(w http.ResponseWriter, r *http.Request) {
	loggedIn := LoggedInVerif(r) // verify if the cookie is setup with a session token
	DuplicateLog(loggedIn, w, r) // verify if the cookie is unique (handle double connection)

	user := &methods.User{} // get username of connected user
	if loggedIn {
		cookie, err := r.Cookie("session_token")
		if err != nil {
			ErrorHandler(w, r, http.StatusBadRequest, "gathering cookie error")
			return
		}

	}

}

func DeletePost(w http.ResponseWriter, r *http.Request) {

}

func EditPost(w http.ResponseWriter, r *http.Request) {

}
