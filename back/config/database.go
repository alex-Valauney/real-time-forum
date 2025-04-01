package config

import (
	"database/sql"
	"fmt"
	"log"
	"rtf/back/methods"

	_ "github.com/mattn/go-sqlite3"
)

func Database() { // create database and create all table
	db, err := sql.Open("sqlite3", "./RTF.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	DefineTables(db)
}

func DefineTables(db *sql.DB) { // define and create all tables
	usersTable := `CREATE TABLE IF NOT EXISTS users (
			"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			"uuid" VARCHAR(36) NOT NULL UNIQUE,
			"nickname" VARCHAR(255) NOT NULL UNIQUE,
			"age" INTEGER NOT NULL,
			"gender" INTEGER NOT NULL,
			"first_name" VARCHAR(25) NOT NULL,
			"last_name" Varchar(25) NOT NULL,
			"email" VARCHAR(255) NOT NULL UNIQUE,
			"password" VARCHAR(72) NOT NULL
		);`
	postsTable := `CREATE TABLE IF NOT EXISTS posts (
			"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,        
			"title" VARCHAR(255) NOT NULL,
			"content" TEXT NOT NULL,
			"date" VARCHAR(32) NOT NULL,
			"user_id" INTEGER NOT NULL,
			FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
		);`
	commentsTable := `CREATE TABLE IF NOT EXISTS comments (
			"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,        
			"content" TEXT NOT NULL,
			"date" VARCHAR(32) NOT NULL,
			"user_id" INTEGER, 
			"post_id" INTEGER NOT NULL,
			FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
			FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
		);`
	categoriesTable := `CREATE TABLE IF NOT EXISTS categories (
			"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,        
			"name" VARCHAR(32) NOT NULL UNIQUE
		);`
	catPostRelTable := `CREATE TABLE IF NOT EXISTS catpostrel (
			"cat_id" INTEGER NOT NULL,
			"post_id" INTEGER NOT NULL,
			FOREIGN KEY(cat_id) REFERENCES categories(id) ON DELETE CASCADE,
			FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
		);`
	privateMessageTable := `CREATE TABLE IF NOT EXISTS privatemessages (
			"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			"user_from" INTEGER NOT NULL,
			"user_to" INTEGER NOT NULL,
			"content" VARCHAR,
			"date" VARCHAR(32) NOT NULL,
			FOREIGN KEY(user_from) REFERENCES users(id) ON DELETE CASCADE,
			FOREIGN KEY(user_to) REFERENCES users(id) ON DELETE CASCADE
		);`

	// create all tables with above definitions
	CreateTable(db, usersTable, "users")
	CreateTable(db, postsTable, "posts")
	CreateTable(db, commentsTable, "comments")
	CreateTable(db, categoriesTable, "categories")
	CreateTable(db, catPostRelTable, "cat_post_rel")
	CreateTable(db, privateMessageTable, "private_messages")
	InsertCategories()
}

func CreateTable(db *sql.DB, createTableSQL string, tableName string) { //create one table already defined
	_, err := db.Exec(createTableSQL)
	if err != nil {
		log.Fatalf("Creation table Failed %s : %v", tableName, err)
	}
	fmt.Printf("Table %s already exist.\n", tableName)
}

func InsertCategories() {

	db := &methods.BDD{}

	cat1 := "INSERT INTO categories(id, name) VALUES (1, 'cat1');"
	cat2 := "INSERT INTO categories(id, name) VALUES (2, 'cat2');"
	cat3 := "INSERT INTO categories(id, name) VALUES (3, 'cat3');"
	cat4 := "INSERT INTO categories(id, name) VALUES (4, 'cat4');"

	db.OpenConn()

	_, err := db.Conn.Exec(cat1)

	if err != nil {
		fmt.Println(err)
	}
	_, err = db.Conn.Exec(cat2)

	if err != nil {
		fmt.Println(err)
	}

	_, err = db.Conn.Exec(cat3)

	if err != nil {
		fmt.Println(err)
	}

	_, err = db.Conn.Exec(cat4)

	if err != nil {
		fmt.Println(err)
	}

	db.CloseConn()

}
