package methods

import "fmt"

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
	result, err := db.Conn.Exec(stmt, obj["content"], obj["date"], obj["user_id"], obj["post_id"])
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
	result, err := db.Conn.Query(stmt, obj["id"])
	if err != nil {
		fmt.Println(err)
		return Response{[]Comment{}}
	}

	tabCom := []Comment{}
	for result.Next() {
		comment := Comment{}
		result.Scan(&comment.Id, &comment.Content, &comment.Date, &comment.User_id, &comment.Post_id)
		tabCom = append(tabCom, comment)
	}
	return Response{tabCom}
}
