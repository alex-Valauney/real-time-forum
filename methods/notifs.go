package methods

import (
	"database/sql"
	"fmt"
)

type NotifMethod struct {
	DB *sql.DB
}

func (db *NotifMethod) InsertInNotifs(notif *Notif) (int, error) {
	if notif.UserFrom.ID == notif.UserTo.ID {
		return 0, nil
	}
	query := `INSERT INTO notifs (date, type_id, user_id_to, user_id_from, post_id) VALUES (?, ?, ?, ?, ?)`
	result, err := db.DB.Exec(query, notif.Date, notif.Type, notif.UserTo.ID, notif.UserFrom.ID, notif.Post.ID)
	if err != nil {
		fmt.Println(err)
		return 0, err
	}
	notifID, err := result.LastInsertId()
	if err != nil {
		fmt.Println(err)
		return 0, err
	}

	if notif.Comment != nil {
		_, err := db.DB.Exec("UPDATE notifs SET comments_id = ? WHERE id = ?", notif.Comment.ID, notifID)
		if err != nil {
			fmt.Println(err)
			return 0, err
		}
	}
	return int(notifID), nil
}

func (db *NotifMethod) DeleteInNotifs(id string) error {
	query := "DELETE FROM notifs WHERE id = ?"
	_, err := db.DB.Exec(query, id)
	return err
}

func (db *NotifMethod) DeleteAllNotifPost(idPost, idUser int) error {
	query := "DELETE FROM notifs WHERE user_id_to = ? AND post_id = ?"
	_, err := db.DB.Exec(query, idUser, idPost)
	if err != nil {
		fmt.Println(err)
	}
	return err
}

func (db *NotifMethod) DeleteNotifPost(idPost, idUser int, typeNotif ...int) error {
	for _, i := range typeNotif {
		query := "DELETE FROM notifs WHERE user_id_to = ? AND post_id = ? AND type_id = ?"
		_, err := db.DB.Exec(query, idUser, idPost, i)
		if err != nil {
			fmt.Println(err)
			return err
		}
	}

	return nil
}
