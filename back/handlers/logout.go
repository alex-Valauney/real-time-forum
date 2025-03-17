package handlers

import (
	"net/http"
	"rtf/back/utilitary"
)

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost && r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	cookie, err := r.Cookie("session_token") // validity of cookie
	if err != nil {
		if err == http.ErrNoCookie { // invalid cookie redirect to login
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}
		http.Error(w, "Gathering cookie error", http.StatusBadRequest)
		return
	}

	sessionToken := cookie.Value // delete cookie and close session
	delete(utilitary.Sessions, sessionToken)
	cookie.MaxAge = -1
	http.SetCookie(w, cookie)

	http.Redirect(w, r, "/", http.StatusSeeOther)
}
