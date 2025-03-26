package handlers

import (
	"encoding/json"
	"net/http"
	"rtf/back/methods"
	"rtf/back/utilitary"
)

func GetUserHandler(w http.ResponseWriter, r *http.Request) {
	encoder := json.NewEncoder(w)
	cookie, err := r.Cookie("session_token") // get uuid of connected user
	if err != nil {
		if err == http.ErrNoCookie {
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			encoder.Encode("0")
			return
		}
		http.Error(w, "gathering cookie error", http.StatusBadRequest)
		encoder.Encode("0")
		return
	}

	userUUID := utilitary.Sessions[cookie.Value]

	BDDConn := &methods.BDD{}
	BDDConn.OpenConn()
	user := BDDConn.SelectUserByUuid(userUUID)
	BDDConn.CloseConn()

	userJson, _ := json.Marshal(user.Result)

	encoder.Encode(userJson)
}
