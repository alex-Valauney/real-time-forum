package main

import "net/http"

func LoggedInVerif(r *http.Request) bool { // verify the existence of a cookie
	cookie, err := r.Cookie("session_token")
	loggedIn := false
	if err == nil && cookie.Value != "" {
		loggedIn = true
	}
	return loggedIn
}
