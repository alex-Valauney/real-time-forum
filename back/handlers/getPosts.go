package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"rtf/back/methods"
	"strconv"
	"strings"
)

func GetNextPostsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	lastId := r.URL.Query().Get("id")
	lastIdInt := 0
	if lastId != "" {
		lastIdTab := strings.Split(lastId, "-")
		lastIdInt, _ = strconv.Atoi(lastIdTab[1])
	}

	BDDConn := &methods.BDD{}

	stmt := "SELECT * FROM posts "
	if lastIdInt != 0 {
		stmt += "WHERE id < ? "
	}
	stmt += "LIMIT 10 ORDER BY id DESC;"

	var result *sql.Rows
	var err error

	BDDConn.OpenConn()
	if lastIdInt != 0 {
		result, err = BDDConn.Conn.Query(stmt, lastIdInt)
		if err != nil {
			fmt.Println(err)
			json.NewEncoder(w).Encode(methods.Response{})
		}
	} else {
		result, err = BDDConn.Conn.Query(stmt)
		if err != nil {
			fmt.Println(err)
			json.NewEncoder(w).Encode(methods.Response{})
		}
	}
	BDDConn.CloseConn()

	tabResult := []methods.Post{}
	for result.Next() {
		post := methods.Post{}
		result.Scan(&post.Id, &post.Title, &post.Content, &post.Date, &post.User_id)
		tabResult = append(tabResult, post)
	}

	json.NewEncoder(w).Encode(methods.Response{Result: tabResult})

}
