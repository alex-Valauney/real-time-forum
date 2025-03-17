package utilitary

import "net/http"

func VerifyContent(content string) bool {
	if content == "" {
		return true
	}
	if content[0] == ' ' || content[0] == '\n' || content[0] == '\r' {
		return VerifyContent(content[1:])
	}
	return false
}

// refacto because err != nil was frustrating
func ErrDiffNil(err error, w http.ResponseWriter, r *http.Request, code int, msg string) {
	if err != nil {
		http.Error(w, msg, code)
		return
	}
}
