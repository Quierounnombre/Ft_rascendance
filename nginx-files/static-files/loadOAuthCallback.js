import { setCookie } from "./cookiesManagement.js";

export default function loadOAuthCallback() {
	fetch("https://" + window.location.hostname + ":" + window.location.port + "/profile/auth_callback/" + window.location.search).then(
		(response) => {
            response.json().then((data) => {
            setCookie("token", data.token)
			window.location.search = ""
            window.location.hash = ""
        })});
}