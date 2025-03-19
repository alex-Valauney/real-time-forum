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

func GetNextComsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	idPost := r.URL.Query().Get("idPost")
	if idPost == "" {
		fmt.Println("Parent post id not found")
		return
	}
	idPostInt, _ := strconv.Atoi(idPost)

	idLastCom := r.URL.Query().Get("idCom")
	idLastComInt := 0
	if idLastCom != "" {
		temp := strings.Split(idLastCom, "-")
		idLastComInt, _ = strconv.Atoi(temp[1])
	}

	BDDConn := &methods.BDD{}

	stmt := "SELECT * FROM comments WHERE post_id = ? "
	if idLastComInt != 0 {
		stmt += "AND id < ?"
	}
	stmt += "ORDER BY id DESC;"

	var result *sql.Rows
	var err error

	BDDConn.OpenConn()
	if idLastComInt == 0 {
		result, err = BDDConn.Conn.Query(stmt, idPostInt)
		if err != nil {
			fmt.Println(err)
			json.NewEncoder(w).Encode([]methods.Comment{})
			BDDConn.CloseConn()
			return
		}
	} else {
		result, err = BDDConn.Conn.Query(stmt, idPostInt, idLastComInt)
		if err != nil {
			fmt.Println(err)
			json.NewEncoder(w).Encode([]methods.Comment{})
			BDDConn.CloseConn()
			return
		}
	}
	BDDConn.CloseConn()

	tabCom := []methods.Comment{}
	for result.Next() {
		comment := methods.Comment{}
		result.Scan(&comment.Id, &comment.Content, &comment.Date, &comment.User_id, &comment.Post_id)

		comment = CompleteCom(comment)

		tabCom = append(tabCom, comment)
	}

	json.NewEncoder(w).Encode(tabCom)
}

func CompleteCom(com methods.Comment) methods.Comment {
	BDDConn := &methods.BDD{}

	BDDConn.OpenConn()
	stmt := "SELECT nickname FROM users WHERE id = ?;"
	result := BDDConn.Conn.QueryRow(stmt, com.User_id)
	result.Scan(&com.User_nickname)
	BDDConn.CloseConn()

	return com
}
