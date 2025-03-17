package config

import (
	"log"
	"net/http"
	"rtf/back/handlers"
	"time"
)

func ServerCreate() {
	mux := http.NewServeMux() // Mux for multiple handlers
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))
	mux.Handle("/script/", http.StripPrefix("/script/", http.FileServer(http.Dir("./script"))))
	mux.HandleFunc("/", handlers.IndexHandler)
	mux.HandleFunc("/register", handlers.RegisterHandler)
	mux.HandleFunc("/login", handlers.LoginHandler)
	mux.HandleFunc("/logout", handlers.LogoutHandler)
	mux.HandleFunc("/checkSession", handlers.CheckSessionHandler)
	mux.HandleFunc("/transferPost", handlers.TransferPostHandler)
	mux.HandleFunc("/newPost", handlers.NewPostHandler)
	mux.HandleFunc("/newCom", handlers.NewComHandler)
	mux.HandleFunc("/ws", handlers.WebsocketHandler)

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
