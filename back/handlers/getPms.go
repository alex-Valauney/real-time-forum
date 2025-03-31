package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"rtf/back/methods"
	"slices"
	"strconv"
)

func SpepmHandler(w http.ResponseWriter, r *http.Request) {

	idFrom := r.URL.Query().Get("idclient")
	idTo := r.URL.Query().Get("idto")
	idPm := r.URL.Query().Get("idpm")
	encoder := json.NewEncoder(w)

	if idFrom == "" || idTo == "" {
		encoder.Encode(0)
		return
	}

	stmt := "SELECT * FROM privatemessages WHERE ((user_from = ? AND user_to = ?) OR (user_from = ? AND user_to = ?))"
	if idPm != "" {
		stmt += " AND id < ?"
	}
	stmt += " ORDER BY id DESC;"

	var result *sql.Rows
	var err error

	BDDConn := &methods.BDD{}
	BDDConn.OpenConn()
	// result := BDDConn.SelectPMByFromTo(map[string]any{"user_from": idFrom, "user_to": idTo})

	if idPm == "" {
		result, err = BDDConn.Conn.Query(stmt, idFrom, idTo, idTo, idFrom)
		if err != nil {
			fmt.Println(err)
			encoder.Encode([]methods.Comment{})
			BDDConn.CloseConn()
			return
		}
	} else {
		result, err = BDDConn.Conn.Query(stmt, idFrom, idTo, idTo, idFrom, idPm)
		if err != nil {
			fmt.Println(err)
			encoder.Encode([]methods.Comment{})
			BDDConn.CloseConn()
			return
		}
	}
	BDDConn.CloseConn()

	tabPm := []methods.PrivateMessage{}
	for result.Next() {
		privateMessage := methods.PrivateMessage{}
		result.Scan(&privateMessage.Id, &privateMessage.User_from, &privateMessage.User_to, &privateMessage.Content, &privateMessage.Date)
		tabPm = append(tabPm, privateMessage)
	}

	encoder.Encode(tabPm)
}

func PmHandler(w http.ResponseWriter, r *http.Request) {
	idClient := r.URL.Query().Get("id")
	encoder := json.NewEncoder(w)

	if idClient == "" {
		encoder.Encode([]methods.PrivateMessage{})
		return
	}

	stmt := "SELECT * FROM privatemessages WHERE user_to = ? OR user_from = ? ORDER BY id DESC;"

	BDDConn := &methods.BDD{}
	BDDConn.OpenConn()
	rows, err := BDDConn.Conn.Query(stmt, idClient, idClient)
	BDDConn.CloseConn()

	if err != nil {
		encoder.Encode([]methods.PrivateMessage{})
		return
	}

	tabAllPm := []methods.PrivateMessage{}
	for rows.Next() {
		pm := methods.PrivateMessage{}

		rows.Scan(&pm.Id, &pm.User_from, &pm.User_to, &pm.Content, &pm.Date)

		tabAllPm = append(tabAllPm, pm)
	}

	tabFilteredPm := []methods.PrivateMessage{}
	tabDupeID := []int{}
	idClientInt, _ := strconv.Atoi(idClient)

	for _, pm := range tabAllPm {
		idOther := 0
		if pm.User_from != idClientInt {
			idOther = pm.User_from
		} else if pm.User_to != idClientInt {
			idOther = pm.User_to
		}

		if !slices.Contains(tabDupeID, idOther) {
			tabDupeID = append(tabDupeID, idOther)
			tabFilteredPm = append(tabFilteredPm, pm)
		}
	}

	encoder.Encode(tabFilteredPm)
}
