package handlers

import (
	"encoding/json"
	"net/http"
	"rtf/back/methods"
	"strconv"
)

func GetNextPostsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	lastId := r.URL.Query.Get("id")
	lastIdInt := 0
	if lastId != "" {
		lastIdInt, _ := strconv.Atoi(lastId)
	}

	BDDConn := &methods.BDD{}
	
	stmt := "SELECT * FROM posts "
	if lastIdInt != 0 {
		stmt += "WHERE id < ? "
	}
	stmt += "LIMIT 10 ORDER BY id DESC;"
	
	posts := Response{}

	BDDConn.OpenConn()
	if lastIdInt != 0 {
		posts = BDDConn.conn.Query(stmt, lastIdInt)
	} else {
		posts = BDDConn.conn.Query(stmt)
	}
	BDDConn.CloseConn()

	json.NewEncoder(w).Encode(posts.Result)

}
