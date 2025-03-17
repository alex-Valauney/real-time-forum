package handlers

import (
	"net/http"
	"regexp"
	"rtf/back/methods"
	"rtf/back/utilitary"
	"strconv"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	err := r.ParseForm()
	utilitary.ErrDiffNil(err, w, r, http.StatusBadRequest, "bad request")

	regMap := make(map[string]any)

	names := [3]string{"nickname", "first_name", "last_name"}
	for i := 0; i < len(names); i++ {
		if !utilitary.VerifyContent(r.FormValue(names[i])) { // get content from form (comment)
			regMap[names[i]] = r.FormValue(names[i])
		} else {
			http.Error(w, "names can't be empty", http.StatusBadRequest)
			return
		}
	}

	regMap["age"] = r.FormValue("age")
	regMap["gender"], _ = strconv.Atoi(r.FormValue("gender"))

	mail := r.FormValue("email")                                                                            // get string from form
	if match, err := regexp.MatchString(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`, mail); !match { // verify validity of email's format
		utilitary.ErrDiffNil(err, w, r, http.StatusBadRequest, "invalid email format")
		return
	} else {
		regMap["email"] = mail
	}

	regMap["password"] = r.FormValue("password")

	BDDConn := &methods.BDD{}
	BDDConn.OpenConn()
	user := BDDConn.InsertUser(regMap) // create user in database with data from form
	if err != nil {
		if err.Error() == "UNIQUE constraint failed: users.name" { // display error of already used username
			http.Error(w, "username already used", http.StatusBadRequest)
			return
		} else if err.Error() == "UNIQUE constraint failed: users.email" { // display error of already used email
			http.Error(w, "email already used", http.StatusBadRequest)
			return
		}
	}
	BDDConn.CloseConn()

	utilitary.SessionGen(w, user.Result.(methods.User), false) // create cookie for the session

	http.Redirect(w, r, "/", http.StatusSeeOther)
}
