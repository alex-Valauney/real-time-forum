package methods

import "fmt"

func (db *BDD) InsertPrivateMessage(obj map[string]any) Response {
	/*
		expected input (as json object) :
			{
				user_from : int,
				user_to : int,
				content : string,
				date : string,
				method : InsertPrivateMessage
			}
	*/

	stmt := "INSERT INTO privatemessages(user_from, user_to, content, date) VALUES (?, ?, ?, ?);"
	result, err := db.Conn.Exec(stmt, obj["user_from"], obj["user_to"], obj["content"], obj["date"])
	if err != nil {
		fmt.Println(err)
		return Response{0}
	}

	newMesId, err := result.LastInsertId()
	if err != nil {
		fmt.Println(err)
		return Response{0}
	}
	return Response{newMesId}
}

func (db *BDD) SelectPMByFromTo(obj map[string]any) Response {
	/*
		expected input (as json object) :
		{
			user_from : int,
			user_to : int,
			method : SelectPMByFromTo
		}
	*/
	stmt := "SELECT * FROM privatemessages WHERE (user_from = ? AND user_to = ?) OR (user_from = ? AND user_to = ?);"
	result, err := db.Conn.Query(stmt, obj["user_from"], obj["user_to"], obj["user_to"], obj["user_from"])
	if err != nil {
		fmt.Println(err)
		return Response{[]PrivateMessage{}}
	}

	tabPrivateMessages := []PrivateMessage{}
	for result.Next() {
		privateMessage := PrivateMessage{}
		result.Scan(&privateMessage.Id, &privateMessage.User_from, &privateMessage.User_to, &privateMessage.Content, &privateMessage.Date)
		tabPrivateMessages = append(tabPrivateMessages, privateMessage)
	}
	return Response{tabPrivateMessages}
}
