package main

type Post struct {
	id      int
	title   string
	content string
	user_id int
	date    string
}

type User struct {
	id         int
	nickname   string
	first_name string
	last_name  string
	age        int
	gender     int
	uuid       string
	email      string
}
