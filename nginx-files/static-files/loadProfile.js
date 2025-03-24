import editProfile from "./editProfile.js";
import getUser from "./getUser.js";

export default async function loadProfile() {
	const root = document.getElementById("root");
	const token = localStorage.getItem("token");
	if (!token) {
		window.location.hash = '#anon-menu';
		return ;
	}
	const userElement = await getUserElement(token);
	if (userElement === -1)	
		return ;

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

async function getUserElement(token) {
	const user = await getUser(token);
	if (user === -1) {
		localStorage.removeItem("token");
		window.location.hash = "#anon-menu";
		return -1;
	}

	const emailField = document.createElement("div");
	emailField.setAttribute("class", "mb-3 row");
	emailField.innerHTML = `<label for="" class="col-sm-2 col-form-label">Email: </label>
		<div class="col-sm-10">
		<input type="text" readonly class="form-control-plaintext" id="email" name="email" value="`+ user["email"] +`">`;

	const usernameField = emailField.cloneNode(true);
	const fontField = emailField.cloneNode(true);
	const languageField = emailField.cloneNode(true);

	usernameField.getElementsByTagName("label")[0].setAttribute('for', "username");
	fontField.getElementsByTagName("label")[0].setAttribute('for', "font");
	languageField.getElementsByTagName("label")[0].setAttribute('for', "language");

	usernameField.getElementsByTagName("label")[0].innerHTML="Username: ";
	fontField.getElementsByTagName("label")[0].innerHTML="Font size:";
	languageField.getElementsByTagName("label")[0].innerHTML="Language: ";

	usernameField.getElementsByTagName("input")[0].setAttribute('id', "username");
	fontField.getElementsByTagName("input")[0].setAttribute('id', "font");
	languageField.getElementsByTagName("input")[0].setAttribute('id', "language");

	usernameField.getElementsByTagName("input")[0].setAttribute('name', "username");
	fontField.getElementsByTagName("input")[0].setAttribute('name', "font");
	languageField.getElementsByTagName("input")[0].setAttribute('name', "language");
	
	usernameField.getElementsByTagName("input")[0].setAttribute('value', user["username"]);
	fontField.getElementsByTagName("input")[0].setAttribute('value', user["font"]);
	languageField.getElementsByTagName("input")[0].setAttribute('value', user["language"]);

	const avatar = document.createElement("div");
	avatar.setAttribute("class", "cropped-image");
	avatar.innerHTML = `<img src="` + user["avatar"] + `" alt="` + user["username"] + `'s profile picture" />`;

	const form = document.createElement("form");
	form.setAttribute("id", "profile");

	form.appendChild(avatar);
	form.appendChild(emailField);
	form.appendChild(usernameField);
	form.appendChild(fontField);
	form.appendChild(languageField);
	return form;
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