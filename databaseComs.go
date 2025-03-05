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

/*
	DO NOT PUT THE BDD ORIGIN OBJECT AS A POINTER ON THE METHODS THAT INTERACT WITH THE DATABASE OR THEY WON'T BE FOUND BY REFLECT
*/

func (db BDD) InsertPost(obj map[string]any) Response {
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

func (db BDD) InsertUser(obj map[string]any) Response {
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

	stmt := "INSERT INTO users(uuid, nickname, first_name, last_name, age, gender, email, password)"
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
