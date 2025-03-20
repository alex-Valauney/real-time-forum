package websocket

type Hub struct {
	Clients map[*Client]bool

	Connection chan *Client

	Deconnection chan *Client

	Buffer chan []byte
}

func NewHub() *Hub {
	return &Hub{
		Clients:      map[*Client]bool{},
		Connection:   make(chan *Client),
		Deconnection: make(chan *Client),
		Buffer:       make(chan []byte),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.Connection:
			h.Clients[client] = true
			//broadcast a tout les clien new connection

		case client := <-h.Deconnection:
			if h.Clients[client] {
				delete(h.Clients, client)
				//fermer conn clien
			}

		case message := <-h.Buffer:

			strMessage := string(message)
		}
	}
}
