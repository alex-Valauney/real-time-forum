package websocket

import "container/list"

type Hub struct {
	Clients []*Client
}

func NewHub() *Hub {
	return &Hub{
		Clients: []*Client{},
	}
}

func (h *Hub) run() {
	for {
		select
	}
}