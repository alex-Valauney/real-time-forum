package main

import (
	"database/sql"
	"fmt"

	"github.com/gofrs/uuid"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

type BDD struct {
	conn *sql.DB
}

type Response struct {
	Result any
}

func (db *BDD) OpenConn() {
	conn, err := sql.Open("sqlite3", "./RTF.db")
	if err != nil {
		fmt.Println(err)
		return
	}
	db.conn = conn
}

func (db *BDD) CloseConn() {
	err := db.conn.Close()
	if err != nil {
		fmt.Println(err)
		return
	}
}

func (db *BDD) InsertPost(obj map[string]any) Response {
	/*
		expected input (as json object) :

		{
			user_id : int, (author)
			title : string,
			content : string,
			date : string,
			method : InsertPost
		}

		the order isn't important but the given keys must have the same name as the one in the expected input

		expected output :

		{
			response : int (id of the created post)
		}

		in case of an error, response will be equal to 0
	*/

	// fmt.Println("post to insert : ", obj)
	// fmt.Println("method called : ", obj["method"])
	// fmt.Println("title of the post : ", obj["title"])
	// return Response{0}

	stmt := "INSERT INTO posts(user_id, title, content, date) VALUES (?, ?, ?, ?);"
	result, err := db.conn.Exec(stmt, obj["user_id"], obj["title"], obj["content"], obj["date"])

	if err != nil {
		fmt.Println(err)
		return Response{0}
	}

	id, err := result.LastInsertId()

	if err != nil {
		fmt.Println(err)
		return Response{0}
	}
	return Response{id}
}

func (db *BDD) SelectAllPosts(obj map[string]any) Response {
	/*
		expected input (as json object) :

		{
			method : SelectAllPosts
		}
	*/
	tabResult := []Post{}

	stmt := "SELECT * FROM posts ORDER BY date;"
	result, err := db.conn.Query(stmt)
	if err != nil {
		fmt.Println(err)
		return Response{[]Post{}}
	}

	for result.Next() {
		post := Post{}
		result.Scan(&post.id, &post.title, &post.content, &post.date, &post.user_id)
		tabResult = append(tabResult, post)
	}

	return Response{tabResult}
}

func (db *BDD) SelectPostById(obj map[string]any) Response {
	/*
		expected input (as json object) :

		{
			id : int,
			method : SelectPostById
		}
	*/

	stmt := "SELECT * FROM posts WHERE id = ?;"
	result := db.conn.QueryRow(stmt, obj["id"])

	post := Post{}
	err := result.Scan(&post.id, &post.title, &post.content, &post.date, &post.user_id)
	if err != nil {
		fmt.Println(err)
		return Response{Post{}}
	}
	return Response{post}
}

func (db *BDD) InsertUser(obj map[string]any) Response {
	/*
		expected input (as json object) :

		{
			nickname : string,
			first_name : string,
			last_name : string,
			age : int,
			gender : int,
			email : string,
			password : string
		}
	*/

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(obj["password"].(string)), 12)
	if err != nil {
		fmt.Println(err)
		return Response{0}
	}

	newUUID, err := uuid.NewV4()
	if err != nil {
		fmt.Println(err)
		return Response{0}
	}

	stmt := "INSERT INTO users(uuid, nickname, first_name, last_name, age, gender, email, password) VALUES (?,?,?,?,?,?,?,?);"
	result, err := db.conn.Exec(stmt, newUUID, obj["nickname"], obj["first_name"], obj["last_name"], obj["age"], obj["gender"], obj["email"], passwordHash)
	if err != nil {
		fmt.Println(err)
		return Response{0}
	}

	newUserId, err := result.LastInsertId()
	if err != nil {
		fmt.Println(err)
		return Response{0}
	}
	return Response{newUserId}
}

func (db *BDD) SelectUserById(obj map[string]any) Response {
	/*
		expected input (as json object) :
		{
			id : int,
			method : SelectUserById
		}
	*/

	stmt := "SELECT id, uuid, nickname, age, gender, first_name, last_name, email FROM users WHERE id = ?;"
	result := db.conn.QueryRow(stmt, obj["id"])

	user := User{}
	err := result.Scan(&user.id, &user.uuid, &user.nickname, &user.age, &user.gender, &user.first_name, &user.last_name, &user.email)
	if err != nil {
		fmt.Println(err)
		return Response{User{}}
	}

	return Response{user}
}

func (db *BDD) Authenticate(obj map[string]any) Response {
	/*
		expected input (as json object) :
		{
			name : string, (can be either a nickname or an email)
			password : string,
			method : Authenticate
		}
	*/
	var id int
	var password []byte
	stmt := "SELECT id, password FROM users WHERE nickname = ? OR email = ?;"
	result := db.conn.QueryRow(stmt, obj["name"], obj["name"])
	err := result.Scan(&id, &password)
	if err != nil {
		return Response{User{}}
	}

	err = bcrypt.CompareHashAndPassword(password, []byte(obj["password"].(string)))
	if err != nil {
		return Response{User{}}
	}

	return db.SelectUserById(map[string]any{"id": id})
}

func (db *BDD) InsertComment(obj map[string]any) Response {
	/*
		expected input (as json object) :
		{
			content : string,
			date : string,
			user_id : int (author),
			post_id : int (parent post),
			method : InsertComment
		}
	*/

	stmt := "INSERT INTO comments(content, date, user_id, post_id) VALUES (?, ?, ?, ?);"
	result, err := db.conn.Exec(stmt, obj["content"], obj["date"], obj["user_id"], obj["post_id"])
	if err != nil {
		fmt.Println(err)
		return Response{0}
	}

	newComId, err := result.LastInsertId()
	if err != nil {
		fmt.Println(err)
		return Response{0}
	}
	return Response{newComId}
}

func (db *BDD) SelectCommentsByPostId(obj map[string]any) Response {
	/*
		expected input (as json object) :
			{
				id : int,
				method : SelectCommentByPostId
			}

		Returns all comments which have the given id as the parent post
	*/

	stmt := "SELECT * FROM comments WHERE post_id = ? ORDER BY date;"
	result, err := db.conn.Query(stmt, obj["id"])
	if err != nil {
		fmt.Println(err)
		return Response{[]Comment{}}
	}

	tabCom := []Comment{}
	for result.Next() {
		comment := Comment{}
		result.Scan(&comment.id, &comment.content, &comment.date, &comment.user_id, &comment.post_id)
		tabCom = append(tabCom, comment)
	}
	return Response{tabCom}
}
