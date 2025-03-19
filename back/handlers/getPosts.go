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
	stmt += "ORDER BY id DESC LIMIT 10;"

	var result *sql.Rows
	var err error

	BDDConn.OpenConn()
	if lastIdInt != 0 {
		result, err = BDDConn.Conn.Query(stmt, lastIdInt)
		if err != nil {
			fmt.Println(err)
			json.NewEncoder(w).Encode([]methods.Post{})
			BDDConn.CloseConn()
			return
		}
	} else {
		result, err = BDDConn.Conn.Query(stmt)
		if err != nil {
			fmt.Println(err)
			json.NewEncoder(w).Encode([]methods.Post{})
			BDDConn.CloseConn()
			return
		}
	}
	BDDConn.CloseConn()

	tabResult := []methods.Post{}
	for result.Next() {
		post := methods.Post{}
		result.Scan(&post.Id, &post.Title, &post.Content, &post.Date, &post.User_id)

		post = CompletePost(post)

		tabResult = append(tabResult, post)
	}

	json.NewEncoder(w).Encode(tabResult)

}

func GetNewPosts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	lastId := r.URL.Query().Get("id")
	lastIdInt := 0
	if lastId != "" {
		lastIdTab := strings.Split(lastId, "-")
		lastIdInt, _ = strconv.Atoi(lastIdTab[1])
	} else {
		return
	}

	BDDConn := &methods.BDD{}

	stmt := "SELECT * FROM posts WHERE id > ? ORDER BY id DESC;"

	BDDConn.OpenConn()
	result, err := BDDConn.Conn.Query(stmt, lastIdInt)
	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode([]methods.Post{})
		return
	}
	BDDConn.CloseConn()

	tabResult := []methods.Post{}
	for result.Next() {
		post := methods.Post{}
		result.Scan(&post.Id, &post.Title, &post.Content, &post.Date, &post.User_id)

		post = CompletePost(post)

		tabResult = append(tabResult, post)
	}

	json.NewEncoder(w).Encode(tabResult)
}

func GetPostByIdHandler(w http.ResponseWriter, r *http.Request) {
	postId := r.URL.Query().Get("id")
	if postId == "" {
		fmt.Println("parent post id not found")
		return
	}
	postIdInt, _ := strconv.Atoi(postId)

	BDDConn := &methods.BDD{}
	BDDConn.OpenConn()
	result := BDDConn.SelectPostById(postIdInt)
	BDDConn.CloseConn()

	json.NewEncoder(w).Encode(result.Result)
}

func CompletePost(post methods.Post) methods.Post {
	BDDConn := &methods.BDD{}

	BDDConn.OpenConn()
	stmt1 := "SELECT nickname FROM users WHERE id = ?;"
	result1 := BDDConn.Conn.QueryRow(stmt1, post.User_id)
	result1.Scan(&post.User_nickname)

	stmt2 := "SELECT COUNT(*) FROM comments WHERE post_id = ?;"
	result2 := BDDConn.Conn.QueryRow(stmt2, post.Id)
	result2.Scan(&post.Comment_count)
	BDDConn.CloseConn()

	return post
}
