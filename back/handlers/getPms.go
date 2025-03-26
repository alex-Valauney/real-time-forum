package handlers

import (
	"encoding/json"
	"net/http"
	"rtf/back/methods"
)

func SpepmHandler(w http.ResponseWriter, r *http.Request) {
	idFrom := r.URL.Query().Get("idclient")
	idTo := r.URL.Query().Get("idto")
	encoder := json.NewEncoder(w)

	if idFrom == "" || idTo == "" {
		encoder.Encode(0)
		return
	}

	BDDConn := &methods.BDD{}
	BDDConn.OpenConn()
	result := BDDConn.SelectPMByFromTo(map[string]any{"user_from": idFrom, "user_to": idTo})
	BDDConn.CloseConn()

	encoder.Encode(result.Result)
}
