package websocket

import (
	"encoding/json"
	"fmt"
	"rtf/back/methods"
)

type Hub struct {
	Clients      map[*Client]bool
	Connection   chan *Client
	Deconnection chan *Client
	Buffer       chan []byte
}

func NewHub() *Hub {
	return &Hub{
		Clients:      map[*Client]bool{},
		Connection:   make(chan *Client),
		Deconnection: make(chan *Client),
		Buffer:       make(chan []byte),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Connection:
			h.Clients[client] = true
			h.BroadcastUserList()

		case client := <-h.Deconnection:
			if h.Clients[client] {
				delete(h.Clients, client)
				client.Conn.Close()
			}
			h.BroadcastUserList()

		case message := <-h.Buffer:
			/*
				'{"user_to":1,"user_from":2,"content":"messagem mdr","date":"2022-02-03"}'
			*/
			var obj map[string]any
			obj["method"] = "newPM"

			json.Unmarshal(message, &obj)
			fmt.Println(obj)

			BDDConn := &methods.BDD{}

			BDDConn.OpenConn()
			result := BDDConn.InsertPrivateMessage(obj)
			BDDConn.CloseConn()

			if result.Result == 0 {
				continue
			}

			found := false
			for c := range h.Clients {
				fmt.Println(*c.User)
				fmt.Printf("%T, %T\n", c.User.Id, obj["user_to"])
				if c.User.Id == int(obj["user_to"].(float64)) {
					data, _ := json.Marshal(obj)
					c.Buffer <- data
					found = true
					break
				}
			}
			if found {
				fmt.Println("Message sent")
			} else {
				fmt.Println("User not found")
			}
		}
	}
}

func (h *Hub) BroadcastUserList() {
	BDDConn := &methods.BDD{}

	type UserList struct {
		AllUsers    []methods.User
		OnlineUsers []methods.User
		Method      string
	}

	AllUserList := UserList{Method: "userListProcess"}
	BDDConn.OpenConn()
	AllUserList.AllUsers = BDDConn.SelectAllUsers().Result.([]methods.User)
	BDDConn.CloseConn()

	for c := range h.Clients {
		AllUserList.OnlineUsers = append(AllUserList.OnlineUsers, *c.User)

	}
	data, err := json.Marshal(AllUserList)
	if err != nil {
		fmt.Println(err)
		return
	}

	for c := range h.Clients {
		c.Buffer <- data
	}
}
