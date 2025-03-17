package handlers

import (
	"encoding/json"
	"net/http"
	"rtf/back/methods"
)

func TransferPostHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	BDDConn := &methods.BDD{}
	BDDConn.OpenConn()
	posts := BDDConn.SelectAllPosts(map[string]any{})
	BDDConn.CloseConn()

	json.NewEncoder(w).Encode(posts.Result)

}
