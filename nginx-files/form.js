"use strict";
import displayUsers from "./displayUsers.js";

const form = document.getElementById("my_form");
let token;

async function sendData() {
	const formData = new FormData(form);

	try {
		const response = await fetch("http://localhost:8080/profile/login/", {
			method: "POST",
			body: formData,
		});
		const data = await response.json();
		token = data.token;
		if (token) {
			await displayUsers(token);
			validLogin();
		} else {
			invalidLogin();
			//hide users
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