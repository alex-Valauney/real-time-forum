package handlers

import (
	"net/http"
	"rtf/back/methods"
	"rtf/back/utilitary"
	"strconv"
	"time"
)

func NewPostHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	BDDConn := &methods.BDD{}

	err := r.ParseForm()
	utilitary.ErrDiffNil(err, w, r, http.StatusBadRequest, "bad request")

	postMap := make(map[string]any)

	userUuid := utilitary.UuidFromCookie(w, r)
	BDDConn.OpenConn()
	user := BDDConn.SelectUserByUuid(userUuid)
	BDDConn.CloseConn()
	postMap["user_id"] = user.Result.(methods.User).Id

	postFields := [2]string{"title", "content"}
	for i := 0; i < len(postFields); i++ {
		if !utilitary.VerifyContent(r.FormValue(postFields[i])) {
			postMap[postFields[i]] = r.FormValue(postFields[i])
		} else {
			http.Error(w, "can't post with an empty title or empty content", http.StatusBadRequest)
			return
		}
	}
	itsTime := time.Now()
	postMap["date"] = FormatDate(itsTime)

	postCat := [4]string{"cat1", "cat2", "cat3", "cat4"}
	var categories []int
	atLeastOneCat := false //verify there's at least one category for the new post
	for i := 0; i < len(postCat); i++ {
		cat, _ := strconv.Atoi(r.FormValue(postCat[i]))
		categories = append(categories, cat)
		if postMap[postCat[i]] != "" {
			atLeastOneCat = true
		}
	}
	if !atLeastOneCat { // send error if not the case
		http.Error(w, "need at least one category", http.StatusBadRequest)
		return
	}
	postMap["categories"] = categories

	BDDConn.OpenConn()
	BDDConn.InsertPost(postMap)
	BDDConn.CloseConn()

	http.Redirect(w, r, "/", http.StatusSeeOther)
}
