package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"reflect"

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
func WebsocketHandler(w http.ResponseWriter, r *http.Request) {
	// Upgrade http connection to ws connection
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("erreur1 :", err)
		return
	}
	defer conn.Close()

	BDDConn := &BDD{}

	// Handle messages
	for {
		_, data, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("erreur2 :", err)
			continue
		}

		var obj map[string]any

		json.Unmarshal(data, &obj)

		if obj["method"] == nil {
			fmt.Println("missing method")
			continue
		}

		BDDConn.OpenConn()

		f := reflect.ValueOf(BDDConn).MethodByName(obj["method"].(string))
		if !f.IsValid() {
			fmt.Println("invalid method")
			continue
		}
		result := f.Call([]reflect.Value{reflect.ValueOf(obj)})[0].Interface().(Response)

		BDDConn.CloseConn()

		err = conn.WriteJSON(result)
		if err != nil {
			fmt.Println("erreur3 :", err)
			continue
		}
		// fmt.Println(string(resultJSON))
		// fmt.Println("type: ", messType)
		// fmt.Println("data: ", data)
		// fmt.Println()

		err = conn.WriteJSON(result)
		if err != nil {
			fmt.Println("erreur4 :", err)
			continue
		}
	}
}
