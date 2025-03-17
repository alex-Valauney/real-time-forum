package methods

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

func (db *BDD) OpenConn() {
	conn, err := sql.Open("sqlite3", "./RTF.db")
	if err != nil {
		fmt.Println(err)
		return
	}
	db.Conn = conn
}

func (db *BDD) CloseConn() {
	err := db.Conn.Close()
	if err != nil {
		fmt.Println(err)
		return
	}
}
