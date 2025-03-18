package handlers

import (
	"net/http"
	"rtf/back/methods"
	"rtf/back/utilitary"
	"time"
)

func NewComHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowes", http.StatusMethodNotAllowed)
		return
	}

	BDDConn := &methods.BDD{}

	err := r.ParseForm()
	utilitary.ErrDiffNil(err, w, r, http.StatusBadRequest, "bad request")

	comMap := make(map[string]any)

	userUuid := utilitary.UuidFromCookie(w, r)
	BDDConn.OpenConn()
	user := BDDConn.SelectUserByUuid(map[string]any{"uuid": userUuid})
	BDDConn.CloseConn()
	comMap["user_id"] = user.Result.(methods.User).Id

	postFields := [1]string{"content"}
	for i := 0; i < len(postFields); i++ {
		if !utilitary.VerifyContent(r.FormValue(postFields[i])) {
			comMap[postFields[i]] = r.FormValue(postFields[i])
		} else {
			http.Error(w, "can't post with an empty title or empty content", http.StatusBadRequest)
			return
		}
	}

	comMap["date"] = time.Now()

	comMap["post_id"] = 1 //RECUPERER L'ID DU POST

	BDDConn.OpenConn()
	BDDConn.InsertComment(comMap)
	BDDConn.CloseConn()

	http.Redirect(w, r, "/", http.StatusSeeOther)
}
