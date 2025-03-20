package websocket

type Hub struct {
	Clients map[*Client]bool
}

func NewHub() *Hub {
	return &Hub{
		Clients: map[*Client]bool{},
	}
}

func (h *Hub) run() {
	for {
		select {}
	}
}
