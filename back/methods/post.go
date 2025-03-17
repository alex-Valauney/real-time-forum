package methods

import "fmt"

func (db *BDD) InsertPost(obj map[string]any) Response {
	/*
		expected input (as json object) :

		{
			user_id : int, (author)
			title : string,
			content : string,
			date : string,
			categories : []int,
			method : InsertPost
		}

		the order isn't important but the given keys must have the same name as the one in the expected input

		expected output :

		{
			response : int (id of the created post)
		}

		in case of an error, response will be equal to 0
	*/

	/*fmt.Println("post to insert : ", obj)
	fmt.Println("method called : ", obj["method"])
	fmt.Println("title of the post : ", obj["title"])
	return Response{0}*/

	stmt := "INSERT INTO posts(user_id, title, content, date) VALUES (?, ?, ?, ?);"
	result, err := db.Conn.Exec(stmt, obj["user_id"], obj["title"], obj["content"], obj["date"])

	if err != nil {
		fmt.Println(err)
		return Response{0}
	}

	id, err := result.LastInsertId()

	if err != nil {
		fmt.Println(err)
		return Response{0}
	}
	stmt = "INSERT INTO catpostrel(cat_id, post_id) VALUES (?, ?);"
	for i := 0; i < len(obj["categories"].([]int))-1; i++ {
		_, err = db.Conn.Exec(stmt, obj["categories"].([]int)[i], id)
		if err != nil {
			fmt.Println(err)
		}
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
	result, err := db.Conn.Query(stmt)
	if err != nil {
		fmt.Println(err)
		return Response{[]Post{}}
	}

	for result.Next() {
		post := Post{}
		result.Scan(&post.Id, &post.Title, &post.Content, &post.Date, &post.User_id)
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
	result := db.Conn.QueryRow(stmt, obj["id"])

	post := Post{}
	err := result.Scan(&post.Id, &post.Title, &post.Content, &post.Date, &post.User_id)
	if err != nil {
		fmt.Println(err)
		return Response{Post{}}
	}
	return Response{post}
}
