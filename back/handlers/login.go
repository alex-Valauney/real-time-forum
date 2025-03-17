package handlers

import (
	"net/http"
	"rtf/back/methods"
	"rtf/back/utilitary"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowes", http.StatusMethodNotAllowed)
		return
	}

	err := r.ParseForm()
	utilitary.ErrDiffNil(err, w, r, http.StatusBadRequest, "bad request")

	password := r.FormValue("password") // get password and email from form
	auth := r.FormValue("name")
	rememberMe := r.FormValue("remember") == "remember" // get remember me option from form

	logMap := make(map[string]any)
	logMap["password"] = password
	logMap["name"] = auth

	BDDConn := &methods.BDD{}
	BDDConn.OpenConn()
	user := BDDConn.Authenticate(logMap) // verify credentials in database and get uuid from user
	BDDConn.CloseConn()

	utilitary.ErrDiffNil(err, w, r, http.StatusBadRequest, "Invalid credentials") // return to invalid credentials if error

	for token := range utilitary.Sessions { // delete cookie if already connected
		if utilitary.Sessions[token] == user.Result.(methods.User).Uuid {
			delete(utilitary.Sessions, token)
			break
		}
	}
	utilitary.SessionGen(w, user.Result.(methods.User), rememberMe) // recreate cookie for the session

	http.Redirect(w, r, "/", http.StatusSeeOther)
}
