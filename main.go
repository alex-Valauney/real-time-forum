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

	DB_PATH = "forum.db"
	BDD() // create database and tables

	db, err := sql.Open("sqlite3", DB_PATH) // open database for nexts functions
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	_, err = db.Exec(`PRAGMA foreign_keys = ON;`)
	if err != nil {
		log.Fatalf("pragma en sang")
	}

	InsertNamesInDB(db, []string{"Astuces", "Étangs", "Coins pêche", "Prises", "Bateaux", "Crustacés", "Coquillages", "Poissons"}, `INSERT INTO categories (name) VALUES (?)`)
	InsertNamesInDB(db, []string{"Drowned", "Classic", "Moderator", "Administrator"}, `INSERT INTO roles (name) VALUES (?)`)
	InsertNamesInDB(db, []string{"likepost", "dislikepost", "likecom", "dislikecom", "comonpost", "askmod", "reportpost", "reportcom", "adminanswer"}, `INSERT INTO types (name) VALUES (?)`)

	ServerCreate() // build TLS structure, and then launch server

}

func ServerCreate() {

	// No error/logout handler directly, see handlersBasic.go/handlersLog.go for this
	indexHandler := func(w http.ResponseWriter, r *http.Request) {
		IndexHandler(w, r)
	}

	mux := http.NewServeMux() // Mux for multiple handlers
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))
	mux.Handle("/script/", http.StripPrefix("/script/", http.FileServer(http.Dir("./script"))))
	mux.HandleFunc("/", indexHandler)
	mux.HandleFunc("/ws", wshandler)

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

	tmpl, err := template.ParseFiles("index.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Exécute le template avec les données
	err = tmpl.Execute(w, nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
