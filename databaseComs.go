package main

import (
	"database/sql"
	"fmt"
)

type BDD struct {
	conn *sql.DB
}

func (db BDD) InsertPost(obj map[string]any) int64 {
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

		the id of the created post
		in case of an error, the method will return 0
	*/

	result, err := db.conn.Exec("INSERT INTO posts(user_id, title, content, date) VALUES (?, ?, ?, ?);", obj["user_id"], obj["title"], obj["content"], obj["date"])

	if err != nil {
		fmt.Println(err)
		return 0
	}

	id, err := result.LastInsertId()

	if err != nil {
		fmt.Println(err)
		return 0
	}
	return id
}
