package main

import (
	"database/sql"
	"log"
	"net/http"
	"text/template"
	"time"
)

var DB_PATH string

func main() {

	Database() // create database and tables

	db, err := sql.Open("sqlite3", DB_PATH) // open database for nexts functions
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	_, err = db.Exec(`PRAGMA foreign_keys = ON;`)
	if err != nil {
		log.Fatalf("pragma en sang")
	}

	ServerCreate() // build TLS structure, and then launch server
}

func ServerCreate() {
	mux := http.NewServeMux() // Mux for multiple handlers
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))
	mux.Handle("/script/", http.StripPrefix("/script/", http.FileServer(http.Dir("./script"))))
	mux.HandleFunc("/", IndexHandler)
	mux.HandleFunc("/ws", WebsocketHandler)

	server := &http.Server{
		Addr:              ":8080",          //adresse du server
		Handler:           mux,              // listes des handlers
		ReadHeaderTimeout: 10 * time.Second, // temps autorisé pour lire les headers
		WriteTimeout:      10 * time.Second, // temps maximum d'écriture de la réponse
		IdleTimeout:       30 * time.Second, // temps maximum entre deux rêquetes
		MaxHeaderBytes:    1 << 20,          // 1 MB // maximum de bytes que le serveur va lire
	}

	log.Println("http://localhost:8080")
	if err := server.ListenAndServe(); err != nil { // open server
		log.Fatal(err)
	}
}

// function to handle the index requests
func IndexHandler(w http.ResponseWriter, r *http.Request) {
	loggedIn := LoggedInVerif(r) // verify if the cookie is setup with a session token
	DuplicateLog(loggedIn, w, r) // verify if the cookie is unique (handle double connection)

	tmpl, err := template.ParseFiles("index.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	data := struct {
		LoggedIn bool
	}{
		LoggedIn: loggedIn,
	}

	// Exécute le template avec les données
	err = tmpl.Execute(w, data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
