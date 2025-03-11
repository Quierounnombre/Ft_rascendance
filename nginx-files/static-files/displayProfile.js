async function getUsers(token) {
	try {
		const response = await fetch("https://" + window.location.hostname + ":7000/profile/me/", {
			method: "GET",
			headers: {
				"Authorization": "Token " + token,
			}
		});
		if (response.ok) {
			const data = await response.json();
			return data;
		} else {
			localStorage.removeItem("token");
		}
	} catch (e) {
		console.error(e);
	}
}

function formatTable(jsonData) {

	var table = "<h2>Hi, " + jsonData["username"] + 
	"<img src=\"" + jsonData["avatar"] + "\" class=\"img-thumbnail\" style=\"max-width:100px\" />\
	</h2>\
	<form id=\"profile\">";

	for (let i in jsonData) {
		if (i !== "email" && i !== "username" && i !== "font" && i !== "language") { continue; };
		table += `<div class="mb-3 row">
    	<label for="` + i + 
		`" class="col-sm-2 col-form-label">`+ i + 
		`</label><div class="col-sm-10"><input type="text" readonly class="form-control-plaintext" id="`+ i + `" name="` + i +
		`" value="` + jsonData[i] +
		`"></div></div>`;
	}
	table += "</form>";
	return table;
}

async function displayProfile(token) {
	const user = await getUsers(token);
	if (!user)
		return ;
	return (formatTable(user));
}

function saveChanges() {
	const form = document.getElementById("profile");
	const formData = new FormData(form);
	const token = localStorage.getItem("token");
	try {
		fetch("https://" + window.location.hostname + ":7000/profile/me/", {
			method: "PUT",
			headers: {
				"Authorization": "Token " + token,
			},
			body: formData,
		}).then((response) => {
			var event = new Event('hashchange');
			window.dispatchEvent(event);
		})
	} catch (e) {
		console.error(e);
	}
}

const button = document.createElement("input");
button.setAttribute("type", "submit");
button.setAttribute("value", "Save Changes");
button.setAttribute("class", "btn btn-primary")
button.setAttribute("id", "submit");
const avatar_field = document.createElement("div");
avatar_field.setAttribute("class", "mb-3 row");
avatar_field.innerHTML = `<label for="avtar" class="col-sm-2 col-form-label">Change Avatar:</label>
		<div class="col-sm-10"><input type="file" class="form-control" id="avtar" name="avatar"</div>`

function editProfile() {
	const form = document.getElementById("profile");
	const fields = form.getElementsByTagName("input");

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		saveChanges();
	});

	[...fields].forEach(field => {
		if (field.name !== "email") {
			field.setAttribute("class", "form-control");
			field.removeAttribute("readonly");
		}
	});

	form.appendChild(avatar_field);
	form.appendChild(button);
}

async function logOut() {
	const token = localStorage.getItem("token");
	try {
		const response = await fetch("https://" + window.location.hostname + ":7000/profile/logout/", {
			method: "POST",
			headers: {
				"Authorization": "Token " + token,
			},
		});
		localStorage.removeItem("token");
		var event = new Event('hashchange');
		window.dispatchEvent(event);
	} catch (e) {
		console.error(e);
	}
}

async function logIn(form) {
	const formData = new FormData(form);

	try {
		const response = await fetch("https://" + window.location.hostname + ":7000/profile/login/", {
			method: "POST",
			body: formData,
		});
		const data = await response.json();
		if (data.token) {
			localStorage.setItem("token", data.token);
			validLogin();
			var event = new Event('hashchange');
			window.dispatchEvent(event);
		} else {
			invalidLogin();
		}
	} catch (e) {
		console.error(e);
	}
}

async function signUp(form) {
	const formData = new FormData(form);

	try {
		const response = await fetch("https://" + window.location.hostname + ":7000/profile/singup/", {
			method: "POST",
			body: formData,
		});
		const data = await response.json();
		if (data.token) {
			localStorage.setItem("token", data.token);
			validLogin();
			var event = new Event('hashchange');
			window.dispatchEvent(event);
		} else {
			invalidLogin();
		}
	} catch (e) {
		console.error(e);
	}
}

function invalidLogin() {
	const form = document.getElementById("form");
	const fields = form.getElementsByTagName("input");
	for (let i = 0; i < fields.length; i++) {
		if (fields[i].type === "submit") {
			continue;
		}
		fields[i].value = "";
		fields[i].classList.add("is-invalid");
		fields[i].classList.remove("is-valid");
	}
}
function validLogin() {
	const form = document.getElementById("form");
	const fields = form.getElementsByTagName("input");
	for (let i = 0; i < fields.length; i++) {
		if (fields[i].type === "submit") {
			continue;
		}
		fields[i].value = "";
		fields[i].classList.add("is-valid");
		fields[i].classList.remove("is-invalid");
	}
}