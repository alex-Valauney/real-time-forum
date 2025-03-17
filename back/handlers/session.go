package handlers

import (
	"encoding/json"
	"net/http"
	"rtf/back/utilitary"
)

func CheckSessionHandler(w http.ResponseWriter, r *http.Request) {
	if !utilitary.LoggedInVerif(r) {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"status": "unauthorized"})
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"status": "authenticated"})
}
