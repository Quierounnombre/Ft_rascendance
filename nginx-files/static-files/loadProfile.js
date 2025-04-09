import editProfile from "./editProfile.js";
import getUser from "./getUser.js";
import getUserElement from "./getUserElement.js";
import translatePage from "./translate.js";

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
	const userElement = await getProfileElement(user);

	console.log(userElement);

	const logoutButton = document.createElement("button");
	logoutButton.setAttribute("type", "button");
	logoutButton.setAttribute("class", "btn btn-lg btn-danger");
    logoutButton.setAttribute("data-i18n-key", "log-out");
	logoutButton.innerHTML = "Log Out";
	logoutButton.addEventListener("click", logOut);

    const editButton = document.createElement("button");
	editButton.setAttribute("type", "button");
    editButton.setAttribute("id", "edit_button");
	editButton.setAttribute("class", "btn btn-lg btn-success me-2");
    editButton.setAttribute("data-i18n-key", "prof-edit");
	editButton.innerHTML = "Edit";
    editButton.addEventListener("click", editProfile);

    const historyButton = document.createElement("button");
	historyButton.setAttribute("type", "button");
	historyButton.setAttribute("class", "btn btn-lg btn-info me-2");
    historyButton.setAttribute("data-i18n-key", "history");
	historyButton.innerHTML = "History";
    historyButton.addEventListener("click", () => {window.location.hash = "#history"});

	root.replaceChildren(userElement);
    root.appendChild(editButton);
    root.appendChild(historyButton);
	root.appendChild(logoutButton);
    translatePage();
}

async function getColors() {
	const token = localStorage.getItem("token")
	const response =  await fetch("https://" + window.location.hostname + ":7000/profile/colors/", {
		method: "GET",
		headers: {
			"Authorization": "Token " + token,
		}
	});
	if (response.ok) {
		const data = await response.json();
		return data;
	} else {
		return -1;
	}
}

async function getProfileElement(user) {
	const basicUserElement = getUserElement(user);
	const colors = await getColors();
	const meField = document.createElement("div");
	meField.setAttribute("class", "mb-3 row");
	meField.innerHTML = `<label for="me_color" data-i18n-key="prof-me-color" class="col-sm-2 form-label col-form-label">Color of my paddle: </label>
		<div class="col-sm-10">
		<input type="color" disabled class="form-control form-control-color" id="me_color" name="me_color" value="`+ colors.me_color +`">`;

	const otherField = meField.cloneNode(true);
	const ballField = meField.cloneNode(true);
	const counterField = meField.cloneNode(true);

	otherField.getElementsByTagName("label")[0].setAttribute('for', "other_color");
	ballField.getElementsByTagName("label")[0].setAttribute('for', "ball_color");
	counterField.getElementsByTagName("label")[0].setAttribute('for', "counter_color");

	otherField.getElementsByTagName("label")[0].setAttribute('data-i18n-key', "prof-other-color");
	ballField.getElementsByTagName("label")[0].setAttribute('data-i18n-key', "prof-ball-color");
	counterField.getElementsByTagName("label")[0].setAttribute('data-i18n-key', "prof-counter-color");

	otherField.getElementsByTagName("label")[0].innerHTML = "Color of opponent's paddle: ";
	ballField.getElementsByTagName("label")[0].innerHTML = "Color of the ball: ";
	counterField.getElementsByTagName("label")[0].innerHTML = "Color of the counter: ";

	otherField.getElementsByTagName("input")[0].setAttribute('id', "other_color");
	ballField.getElementsByTagName("input")[0].setAttribute('id', "ball_color");
	counterField.getElementsByTagName("input")[0].setAttribute('id', "counter_color");

	otherField.getElementsByTagName("input")[0].setAttribute('name', "other_color");
	ballField.getElementsByTagName("input")[0].setAttribute('name', "ball_color");
	counterField.getElementsByTagName("input")[0].setAttribute('name', "counter_color");

	otherField.getElementsByTagName("input")[0].setAttribute('value', colors["other_color"]);
	ballField.getElementsByTagName("input")[0].setAttribute('value', colors["ball_color"]);
	counterField.getElementsByTagName("input")[0].setAttribute('value', colors["counter_color"]);

	basicUserElement.appendChild(meField);
	basicUserElement.appendChild(otherField);
	basicUserElement.appendChild(ballField);
	basicUserElement.appendChild(counterField);

	return(basicUserElement)
}

function logOut() {
	const token = localStorage.getItem("token");
	try {
		fetch("https://" + window.location.hostname + ":7070/profile/logout/", {
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