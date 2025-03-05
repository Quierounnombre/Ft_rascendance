async function getUsers(token) {
	try {
		const response = await fetch("http://localhost:8080/profile/me/", {
			method: "GET",
			headers: {
				"Authorization": "Token " + token,
			}
		});
		const data = await response.json();
		return data;
	} catch (e) {
		console.error(e);
	}
}

function formatTable(jsonData) {
	console.log(jsonData)

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
	return (formatTable(user));
}

function saveChanges() {
	const form = document.getElementById("profile");
	const formData = new FormData(form);
	const token = localStorage.getItem("token")
	formData.values().forEach(x => console.log(x));
	try {
		fetch("http://localhost:8080/profile/me/", {
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

function editProfile() {
	const form = document.getElementById("profile");
	const fields = form.getElementsByTagName("input");
	const button = document.createElement("input");
	button.setAttribute("type", "submit");
	button.setAttribute("value", "Save Changes");
	button.setAttribute("id", "submit");
	form.appendChild(button);

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		saveChanges();
	});

	[...fields].forEach(field => {
		field.setAttribute("class", "form-control");
		field.removeAttribute("readonly");
	});

}

async function logOut() {
	const token = localStorage.getItem("token");
	try {
		const response = await fetch("http://localhost:8080/profile/logout/", {
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
		const response = await fetch("http://localhost:8080/profile/login/", {
			method: "POST",
			body: formData,
		});
		const data = await response.json();
		localStorage.setItem("token", data.token);
		if (data.token) {
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
		const response = await fetch("http://localhost:8080/profile/singup/", {
			method: "POST",
			body: formData,
		});
		const data = await response.json();
		localStorage.setItem("token", data.token);
		if (data.token) {
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
	const emailField = document.getElementById("email");
	const passField = document.getElementById("password");
	emailField.classList.add("is-invalid");
	passField.classList.add("is-invalid");
	emailField.classList.remove("is-valid");
	passField.classList.remove("is-valid");
}
function validLogin() {
	const emailField = document.getElementById("email");
	const passField = document.getElementById("password");
	emailField.classList.add("is-valid");
	passField.classList.add("is-valid");
	emailField.classList.remove("is-invalid");
	passField.classList.remove("is-invalid");
}