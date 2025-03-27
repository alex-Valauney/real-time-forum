package handlers

import (
	"encoding/json"
	"net/http"
	"rtf/back/methods"
	"slices"
	"strconv"
)

func SpepmHandler(w http.ResponseWriter, r *http.Request) {
	idFrom := r.URL.Query().Get("idclient")
	idTo := r.URL.Query().Get("idto")
	encoder := json.NewEncoder(w)

	if idFrom == "" || idTo == "" {
		encoder.Encode(0)
		return
	}

	BDDConn := &methods.BDD{}
	BDDConn.OpenConn()
	result := BDDConn.SelectPMByFromTo(map[string]any{"user_from": idFrom, "user_to": idTo})
	BDDConn.CloseConn()

	encoder.Encode(result.Result)
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
