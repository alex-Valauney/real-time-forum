package handlers

import (
	"html/template"
	"net/http"
	"rtf/back/utilitary"
)

// function to handle the index requests
func IndexHandler(w http.ResponseWriter, r *http.Request) {
	loggedIn := utilitary.LoggedInVerif(r) // verify if the cookie is setup with a session token
	utilitary.DuplicateLog(loggedIn, w, r) // verify if the cookie is unique (handle double connection)

	tmpl, err := template.ParseFiles("./index.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	data := struct {
		LoggedIn bool
	}{
		LoggedIn: loggedIn,
	}

	// Exécute le template avec les données
	err = tmpl.Execute(w, data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
