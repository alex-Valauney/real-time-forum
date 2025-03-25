package websocket

import (
	"encoding/json"
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

			BDDConn := &methods.BDD{}

			type UserList struct {
				AllUser          []methods.User
				AllUserConnected []methods.User
			}

			BDDConn.OpenConn()

			AllUserList := UserList{}
			AllUserList.AllUser = BDDConn.SelectAllUsers().Result.([]methods.User)
			// for _, c := range h.Clients {
			// 	AllUserList.AllUserConnected = append(AllUserList.AllUserConnected, c.User)

			// }
			BDDConn.CloseConn()

		case client := <-h.Deconnection:
			if h.Clients[client] {
				delete(h.Clients, client)
				client.Conn.Close()
			}

		case message := <-h.Buffer:

			var obj map[string]any

			json.Unmarshal(message, &obj)

			BDDConn := &methods.BDD{}

			BDDConn.OpenConn()

			result := BDDConn.InsertPrivateMessage(obj)

			BDDConn.CloseConn()

			if result.Result == 0 {
				continue
			}

			// envoier message
		}
	}
}
