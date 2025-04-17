import { getCookie } from "./cookiesManagement.js";

export function addFriend(id, button) {
	const formData = new FormData();
	const token = getCookie("token");
	const lang = localStorage.getItem("language");
	formData.append("friendID", id)

	fetch("https://" + window.location.hostname + ":" + window.location.port + "/profile/friends/", {
        method: "PUT",
		body: formData,
		headers: {
			"AUTHORIZATION": "Bearer " + token,
		},
	})

	button.setAttribute("class", "btn btn-lg btn-outline-primary");
	button.setAttribute("data-i18n-key", "del-friend");
	if (lang === "ENG" || !lang)
		button.innerHTML = "Delete friend";
	else if (lang === "ESP")
		button.innerHTML = "Eliminar Amigo";
	else if (lang === "CAT")
		button.innerHTML = "Borrar Amic";
}

export function deleteFriend(id, button) {
	const formData = new FormData();
	const token = getCookie("token");
	const lang = localStorage.getItem("language");
	formData.append("friendID", id);

	fetch("https://" + window.location.hostname + ":" + window.location.port + "/profile/friends/", {
        method: "DELETE",
		body: formData,
		headers: {
			"AUTHORIZATION": "Bearer " + token,
		},
	})

	button.setAttribute("class", "btn  btn-lg btn-primary");
	button.setAttribute("data-i18n-key", "add-friend");
	if (lang === "ENG" || !lang)
		button.innerHTML = "Add friend";
	else if (lang === "ESP")
		button.innerHTML = "Añadir Amigo";
	else if (lang === "CAT")
		button.innerHTML = "Afegir Amic";
}

export function manageFriend(id, button) {
	if (button.getAttribute("data-i18n-key")==="del-friend") {
		deleteFriend(id, button)
	} else {
		addFriend(id, button)
	}
}

export function seeProfile(id) {
	localStorage.setItem("user_id", id);
	window.location.hash = "#user"
}

export default {manageFriend, seeProfile}