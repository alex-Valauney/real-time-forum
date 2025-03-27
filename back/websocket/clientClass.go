package websocket

import (
	"fmt"
	"rtf/back/methods"

	"github.com/gorilla/websocket"
)

type Client struct {
	Hub    *Hub
	Conn   *websocket.Conn
	Buffer chan []byte
	User   *methods.User
}

func (c *Client) FrontToBack() {
	for {
		_, data, err := c.Conn.ReadMessage()
		if err != nil {
			fmt.Println("erreurA :", err)
			c.Hub.Deconnection <- c
			c.Conn.Close()
			return
		}

		c.Hub.Buffer <- data
	}
}

func (c *Client) BackToFront() {
	for {
		data := <-c.Buffer

		err := c.Conn.WriteMessage(1, data)

		if err != nil {
			fmt.Println("erreurB :", err)
			c.Hub.Deconnection <- c
			c.Conn.Close()
			return
		}
	}
}
