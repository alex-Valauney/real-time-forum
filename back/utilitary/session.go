package utilitary

import (
	"log"
	"net/http"
	"rtf/back/methods"
	"time"

	"github.com/gofrs/uuid"
)

var Sessions = make(map[string]string)

func TokenGen() (string, error) { // generate a token (which is an UUID)
	token, err := uuid.NewV4()
	if err != nil {
		return "", err
	}
	return token.String(), nil
}

func SessionGen(w http.ResponseWriter, user methods.User, rememberMe bool) { // generate a cookie and a session
	sessionToken, err := TokenGen() // see previous function
	if err != nil {
		log.Fatal(err)
	}
	Sessions[sessionToken] = user.Uuid
	cookie := &http.Cookie{
		Name:     "session_token",
		Value:    sessionToken,
		Expires:  time.Now().Add(1 * time.Hour),
		HttpOnly: true,
		Path:     "/",
	}
	if rememberMe { // if remember option chosen give more time to the cookie
		cookie.Expires = time.Now().Add(72 * time.Hour)
	}
	http.SetCookie(w, cookie)
}

func UuidFromCookie(w http.ResponseWriter, r *http.Request) string {
	cookie, err := r.Cookie("session_token") // get uuid of connected user
	if err != nil {
		if err == http.ErrNoCookie {
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return ""
		}
		http.Error(w, "gathering cookie error", http.StatusBadRequest)
		return ""
	}
	return Sessions[cookie.Value]
}

func LoggedInVerif(r *http.Request) bool { // verify the existence of a cookie
	cookie, err := r.Cookie("session_token")
	loggedIn := false
	if err == nil && cookie.Value != "" {
		loggedIn = true
	}
	return loggedIn
}

func DuplicateLog(loggedIn bool, w http.ResponseWriter, r *http.Request) { // verify if the cookie was already in the map and let only one alive
	if loggedIn {
		countToken := 0
		cookie, _ := r.Cookie("session_token")
		for token := range Sessions {
			if token != cookie.Value {
				countToken++
			}
		}
		if countToken == len(Sessions) { // delete the first cookie existing
			cookie.MaxAge = -1
			http.SetCookie(w, cookie)
			http.Redirect(w, r, "/", http.StatusSeeOther)
		}
	}
}
