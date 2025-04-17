import { setCookie } from "./cookiesManagement.js";

export default function loadOAuthCallback() {
	fetch("https://" + window.location.hostname + ":" + window.location.port + "/profile/auth_callback/" + window.location.search).then(
		(response) => {
            response.json().then((data) => {
            setCookie("token", data.access)
            setCookie("refresh", data.refresh)
            const intervalID = window.setInterval(refreshToken, 3600*1000)
            localStorage.setItem("refreshInterval", intervalID);
			window.location.search = ""
            window.location.hash = ""
        })});
}

function refreshToken() {
	const refresh = getCookie("refresh");
	const formData = new FormData();
	formData.append("refresh", refresh)
	fetch("https://" + window.location.hostname + ":" + window.location.port + "/profile/api/token/refresh/", {
		method: "POST",
		body: formData
	}).then((respose) => {
		respose.json().then((data) => {
			setCookie("token", data.access);
			setCookie("refresh", data.refresh);
		})
	})
}