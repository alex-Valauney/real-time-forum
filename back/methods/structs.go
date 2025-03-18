package methods

import "database/sql"

type BDD struct {
	Conn *sql.DB
}

type Response struct {
	Result any
}

type Post struct {
	Id            int
	Title         string
	Content       string
	User_id       int
	User_nickname string
	Date          string
	Comment_count int
}

type User struct {
	Id         int
	Nickname   string
	First_name string
	Last_name  string
	Age        int
	Gender     int
	Uuid       string
	Email      string
}

type Comment struct {
	Id            int
	Content       string
	User_id       int
	User_nickname string
	Date          string
	Post_id       int
}

type PrivateMessage struct {
	Id        int
	User_from int
	User_to   int
	Content   string
	Date      string
}
