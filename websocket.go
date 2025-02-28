package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// To merge with indexHandler
func wshandler(w http.ResponseWriter, r *http.Request) {
	// Upgrade http connection to ws connection
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("erreur1 :", err)
		return
	}
	defer conn.Close()

	// Handle messages
	for {
		messType, data, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("erreur2 :", err)
			continue
		}
		fmt.Println("type: ", messType)
		fmt.Println("data: ", data)
		fmt.Println()
		err = conn.WriteMessage(messType, data)
		if err != nil {
			fmt.Println("erreur3 :", err)
			continue
		}
	}
}
