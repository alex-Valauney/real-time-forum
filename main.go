package main

import (
	"database/sql"
	"log"
	"rtf/back/config"
	"rtf/back/websocket"
)

var DB_PATH string
var Hub *websocket.Hub

func main() {

	config.Database() // create database and tables

	db, err := sql.Open("sqlite3", DB_PATH) // open database for nexts functions
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`PRAGMA foreign_keys = ON;`)
	if err != nil {
		log.Fatalf("pragma")
	}
	db.Close()

	Hub = websocket.NewHub()

	config.ServerCreate()
}
