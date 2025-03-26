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
	if (user === -1){
		localStorage.removeItem("token");
		window.location.hash = "#anon-menu";
		return -1;
	}
	const userElement = await getUserElement(user);

	const logoutButton = document.createElement("button");
	logoutButton.setAttribute("type", "button");
	logoutButton.setAttribute("class", "btn btn-lg btn-danger");
	logoutButton.innerHTML = "Log Out";
	logoutButton.addEventListener("click", logOut);

    const editButton = document.createElement("button");
	editButton.setAttribute("type", "button");
	editButton.setAttribute("class", "btn btn-lg btn-success me-2");
	editButton.innerHTML = "Edit";
    editButton.addEventListener("click", editProfile);

    const historyButton = document.createElement("button");
	historyButton.setAttribute("type", "button");
	historyButton.setAttribute("class", "btn btn-lg btn-primary me-2");
	historyButton.innerHTML = "History";

	root.replaceChildren(userElement);
    root.appendChild(editButton);
    root.appendChild(historyButton);
	root.appendChild(logoutButton);
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