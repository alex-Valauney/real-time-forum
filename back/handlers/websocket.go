package handlers

import (
	"fmt"
	"net/http"

	"rtf/back/methods"
	"rtf/back/utilitary"
	ws "rtf/back/websocket"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var Hub *ws.Hub = ws.NewHub()

// To merge with indexHandler
func WebsocketHandler(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session_token") // get uuid of connected user
	if err != nil {
		if err == http.ErrNoCookie {
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}
		http.Error(w, "gathering cookie error", http.StatusBadRequest)
		return
	}

	//fmt.Println(utilitary.Sessions[cookie.Value])
	BDDConn := &methods.BDD{}

	BDDConn.OpenConn()
	conUser := BDDConn.SelectUserByUuid(utilitary.Sessions[cookie.Value]).Result.(methods.User)
	BDDConn.CloseConn()

	// Upgrade http connection to ws connection
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("erreur1 :", err)
		return
	}

	newClient := &ws.Client{
		Hub:    Hub,
		Conn:   conn,
		Buffer: make(chan []byte),
		User:   &conUser,
	}

	Hub.Connection <- newClient
	go newClient.BackToFront()
	go newClient.FrontToBack()

	// BDDConn := &methods.BDD{}

	// // Handle messages
	// for {
	// 	_, data, err := conn.ReadMessage()
	// 	if err != nil {
	// 		fmt.Println("erreur2 :", err)
	// 		continue
	// 	}

	// 	var obj map[string]any

	// 	json.Unmarshal(data, &obj)

	// 	if obj["method"] == nil {
	// 		fmt.Println("missing method")
	// 		continue
	// 	}

	// 	BDDConn.OpenConn()

	// 	f := reflect.ValueOf(BDDConn).MethodByName(obj["method"].(string))
	// 	if !f.IsValid() {
	// 		fmt.Println("invalid method")
	// 		continue
	// 	}
	// 	result := f.Call([]reflect.Value{reflect.ValueOf(obj)})[0].Interface().(methods.Response)

	// 	BDDConn.CloseConn()

	// 	if obj["method"] == "Authenticate" || obj["method"] == "InsertUser" {
	// 		if obj["remember"] == nil {
	// 			obj["remember"] = false
	// 		}
	// 		utilitary.SessionGen(w, result.Result.(methods.User), obj["remember"].(bool))
	// 	}

	// 	err = conn.WriteJSON(result)
	// 	if err != nil {
	// 		fmt.Println("erreur3 :", err)
	// 		continue
	// 	}
	// }
}
