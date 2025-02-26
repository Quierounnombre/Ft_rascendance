"use strict";

let token;
function changeLayout() {
	var loc = window.location.hash;
	if (loc == "") {
		loc = "#home"
	}

	if (loc === "#home") {
		loadHome();
	} else {
		loadProfile();
	}
}

const home = document.createElement("div");
home.innerHTML = `
<h1>Welcome to Rascendance</h1>
<button class=\"btn btn-secondary\" type=\"button\" onclick=\"window.location.hash=\'\#profile\'\">See your profile</button>
`;

const profile = document.createElement("div");

const login_page = document.createElement("div");
login_page.innerHTML = `
<h1>Log in to see your profile</h1>
<div id="buttons">
<button class="btn btn-secondary" type="button" id="log_button" onclick="toggleForm('login')">Log in</button>
<button class="btn btn-primary" type="button" id="singup_button" onclick="toggleForm('signup')">Don't have an account? Sign Up!</button>
</div>
<div id="form_div"></div>
`

function loadHome() {
	const root = document.getElementById("root");
	root.replaceChildren(home);
}

async function loadProfile() {
	const root = document.getElementById("root");
	if (token) {
		profile.innerHTML = await displayProfile(token);
		profile.innerHTML += `
		<button class="btn btn-primary" type="button" id="backhome_button" onclick=\"window.location.hash=\'\#home\'\">Back to home</button>
		<button class="btn btn-danger" type="button" id="logout_button" onclick="logOut()">Log out</button>
		`;
		root.replaceChildren(profile);
	} else {
		root.replaceChildren(login_page);
	}
}

async function logOut() {
	const formData = new FormData();
	formData.append("token", token)
	try {
		const response = await fetch("http://localhost:8080/profile/logout/", {
			method: "POST",
			headers: {
				"Authorization": "Token " + token,
			},
		});
		token = "";
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
		token = data.token;
		if (token) {
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
		token = data.token;
		if (token) {
			validLogin();
			window.location.hash = '#profile';
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


window.addEventListener("hashchange", changeLayout);

changeLayout();