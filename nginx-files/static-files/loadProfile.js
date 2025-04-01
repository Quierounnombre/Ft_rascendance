import editProfile from "./editProfile.js";
import getUser from "./getUser.js";
import getUserElement from "./getUserElement.js";

export default async function loadProfile() {
	const root = document.getElementById("root");
	const token = localStorage.getItem("token");
	if (!token) {
		window.location.hash = '#anon-menu';
		return ;
	}

	const user = await getUser(token);
	if (user === -1) {
		localStorage.removeItem("token");
		window.location.hash = "#anon-menu";
		return -1;
	}
	const userElement = await getUserElement(user);

	const logoutButton = document.createElement("button");
	logoutButton.setAttribute("type", "button");
	const editButton = logoutButton.cloneNode();

	editButton.setAttribute("class", "btn btn-secondary");
	editButton.setAttribute("id", "edit_button");
	editButton.innerHTML = "Edit Profile";
	editButton.addEventListener("click", editProfile);

	logoutButton.setAttribute("class", "btn btn-danger");
	logoutButton.innerHTML = "Log Out";
	logoutButton.addEventListener("click", logOut);


	root.replaceChildren(userElement);
	root.appendChild(logoutButton);
	root.appendChild(editButton);
}



function logOut() {
	const token = localStorage.getItem("token");
	try {
		fetch("https://" + window.location.hostname + ":7000/profile/logout/", {
			method: "POST",
			headers: {
				"Authorization": "Token " + token,
			},
		}).then((response) => {
		document.getElementsByTagName("html")[0].style["font-size"] = "16px";
		localStorage.removeItem("token");
		var event = new Event('hashchange');
		window.dispatchEvent(event);
		});
	} catch (e) {
		console.error(e);
	}
}