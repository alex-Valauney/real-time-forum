package handlers

import (
	"fmt"
	"net/http"
	"rtf/back/methods"
	"rtf/back/utilitary"
	"strconv"
	"time"
)

func NewComHandler(w http.ResponseWriter, r *http.Request) {

	postId := r.URL.Query().Get("id")
	if postId == "" {
		fmt.Println(r.URL)
		fmt.Println("parent post not found when creating comment")
		return
	}
	postIdInt, _ := strconv.Atoi(postId)

	BDDConn := &methods.BDD{}

	err := r.ParseForm()
	utilitary.ErrDiffNil(err, w, r, http.StatusBadRequest, "bad request")

	comMap := make(map[string]any)

	userUuid := utilitary.UuidFromCookie(w, r)
	BDDConn.OpenConn()
	user := BDDConn.SelectUserByUuid(userUuid)
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
	itsTime := time.Now
	comMap["date"] = FormatDate(itsTime())

	comMap["post_id"] = postIdInt

	BDDConn.OpenConn()
	BDDConn.InsertComment(comMap)
	BDDConn.CloseConn()

	http.Redirect(w, r, "/", http.StatusSeeOther)
}

func FormatDate(t time.Time) string {
	return t.Format("02-01-2006 15:04:05")
}
