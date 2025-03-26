package methods

import (
	"fmt"

	"github.com/gofrs/uuid"
	"golang.org/x/crypto/bcrypt"
)

func (db *BDD) InsertUser(obj map[string]any) Response {
	/*
		expected input (as json object) :

		{
			nickname : string,
			first_name : string,
			last_name : string,
			age : int,
			gender : int,
			email : string,
			password : string
			method : InsertUser
		}
	*/

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(obj["password"].(string)), 12)
	if err != nil {
		fmt.Println(err)
		return Response{0}
	}

	newUUID, err := uuid.NewV4()
	if err != nil {
		fmt.Println(err)
		return Response{0}
	}

	stmt := "INSERT INTO users(uuid, nickname, first_name, last_name, age, gender, email, password) VALUES (?,?,?,?,?,?,?,?);"
	result, err := db.Conn.Exec(stmt, newUUID, obj["nickname"], obj["first_name"], obj["last_name"], obj["age"], obj["gender"], obj["email"], passwordHash)
	if err != nil {
		fmt.Println(err)
		return Response{0}
	}

	newUserId, err := result.LastInsertId()
	if err != nil {
		fmt.Println(err)
		return Response{0}
	}
	return db.SelectUserById(map[string]any{"id": newUserId})
}

func (db *BDD) SelectUserByUuid(uuid string) Response {
	/*
	   expected input (as json object) :
	   {
	       uuid : string,
	       method : SelectUserById
	   }
	*/

	stmt := "SELECT id, uuid, nickname, age, gender, first_name, last_name, email FROM users WHERE uuid = ?;"
	result := db.Conn.QueryRow(stmt, uuid)

	user := User{}
	err := result.Scan(&user.Id, &user.Uuid, &user.Nickname, &user.Age, &user.Gender, &user.First_name, &user.Last_name, &user.Email)
	if err != nil {
		fmt.Println(err)
		return Response{User{}}
	}

	return Response{user}
}

func (db *BDD) SelectUserById(obj map[string]any) Response {
	/*
		expected input (as json object) :
		{
			id : int,
			method : SelectUserById
		}
	*/

	stmt := "SELECT id, uuid, nickname, age, gender, first_name, last_name, email FROM users WHERE id = ?;"
	result := db.Conn.QueryRow(stmt, obj["id"])

	user := User{}
	err := result.Scan(&user.Id, &user.Uuid, &user.Nickname, &user.Age, &user.Gender, &user.First_name, &user.Last_name, &user.Email)
	if err != nil {
		fmt.Println(err)
		return Response{User{}}
	}

	return Response{user}
}

func (db *BDD) Authenticate(obj map[string]any) Response {
	/*
		expected input (as json object) :
		{
			name : string, (can be either a nickname or an email)
			password : string,
			method : Authenticate
		}
	*/
	var id int
	var password []byte
	stmt := "SELECT id, password FROM users WHERE nickname = ? OR email = ?;"
	result := db.Conn.QueryRow(stmt, obj["name"], obj["name"])
	err := result.Scan(&id, &password)
	if err != nil {
		return Response{User{}}
	}

	err = bcrypt.CompareHashAndPassword(password, []byte(obj["password"].(string)))
	if err != nil {
		return Response{User{}}
	}

	return db.SelectUserById(map[string]any{"id": id})
}
