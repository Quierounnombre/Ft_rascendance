"use strict";

const form = document.getElementById("my_form");
let token;
let users;

async function sendData() {
	const formData = new FormData(form);

	try {
		const response = await fetch("http://localhost:8080/api-token/", {
			method: "POST",
			body: formData,
		});
		const data = await response.json();
		token = data.token;
		if (token) {
			getUsers();
			validLogin();
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

form.addEventListener("submit", (event) => {
	event.preventDefault();
	sendData();
});

function toggleForm() {
	if (form.hasAttribute("hidden")) {
		form.removeAttribute("hidden");
	} else {
		form.setAttribute("hidden", "");
	}
}