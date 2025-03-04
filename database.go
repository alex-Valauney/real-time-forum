package main

import (
	"database/sql"
	"fmt"
	"log"
)

func Database() { // create database and create all table
	db, err := sql.Open("sqlite3", "./")
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
			"gender" INTEGER(1) NOT NULL,
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
			FOREIGN KEY(user_id) REFERENCES users(id)
		);`
	commentsTable := `CREATE TABLE IF NOT EXISTS comments (
			"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,        
			"content" TEXT NOT NULL,
			"date" VARCHAR(32) NOT NULL,
			"user_id" INTEGER, 
			"post_id" INTEGER NOT NULL,
			FOREIGN KEY(user_id) REFERENCES users(id),
			FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
		);`
	categoriesTable := `CREATE TABLE IF NOT EXISTS categories (
			"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,        
			"name" VARCHAR(32) NOT NULL UNIQUE
		);`
	catPostRelTable := `CREATE TABLE IF NOT EXISTS catpostrel (
			"cat_id" INTEGER NOT NULL,
			"post_id" INTEGER NOT NULL,
			FOREIGN KEY(cat_id) REFERENCES categories(id),
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
}

func CreateTable(db *sql.DB, createTableSQL string, tableName string) { //create one table already defined
	_, err := db.Exec(createTableSQL)
	if err != nil {
		log.Fatalf("Creation table Failed %s : %v", tableName, err)
	}
	fmt.Printf("Table %s already exist.\n", tableName)
}

func InsertNamesInDB(db *sql.DB, chosenNames []string, sqlExecQuery string) error { //fill references tables
	var err error
	for _, name := range chosenNames {
		_, err := db.Exec(sqlExecQuery, name)
		if err != nil {
			return err
		}
	}
	return err
}
