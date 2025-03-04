package main

import (
	"database/sql"
	"fmt"
)

type BDD struct {
	conn *sql.DB
}

type Response struct {
	Result any
}

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

	fmt.Println("post to insert : ", obj)
	fmt.Println("method called : ", obj["method"])
	fmt.Println("title of the post : ", obj["title"])
	return Response{0}

	//result, err := db.conn.Exec("INSERT INTO posts(user_id, title, content, date) VALUES (?, ?, ?, ?);", obj["user_id"], obj["title"], obj["content"], obj["date"])

	/* if err != nil {
		fmt.Println(err)
		return Response{0}
	}

	id, err := result.LastInsertId()

	if err != nil {
		fmt.Println(err)
		return Response{0}
	}
	return Response{id} */
}
