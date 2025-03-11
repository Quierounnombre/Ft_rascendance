"use strict";

const signup_form = document.createElement("form");
signup_form.setAttribute("id", "form");
signup_form.setAttribute("class", "container-xl");
const login_form = signup_form.cloneNode();

signup_form.innerHTML = `
	<div class="mb-3">
		<label for="email" class="form-label">Email:</label>
		<input type="email" id="email" name="email" class="form-control" required>
	</div>
	<div class="mb-3">
		<label for="username" class="form-label">Username:</label>
		<input type="text" id="username" name="username" class="form-control" required>
	</div>
	<div class="mb-3">
		<label for="first_name" class="form-label">First Name:</label>
		<input type="text" id="first_name" name="first_name" class="form-control" required>
	</div>
	<div class="mb-3">
		<label for="last_name" class="form-label">Last Name:</label>
		<input type="text" id="last_name" name="last_name" class="form-control" required>
	</div>
	<div class="mb-3">
		<label for="password" class="form-label">Password:</label>
		<input type="password" id="password" name="password" class="form-control" required>
	</div>
	<div class="mb-3">
		<label for="password2" class="form-label">Repeat Password:</label>
		<input type="password" id="password2" name="password2" class="form-control" required>
	</div>
	<input type="submit" value="Sign Up" id="submit">
`
login_form.innerHTML = `
	<div class="mb-3">
		<label for="email" class="form-label">Email:</label>
		<input type="email" id="email" name="email" class="form-control" required>
	</div>
	<div class="mb-3">
		<label for="password" class="form-label">Password:</label>
		<input type="password" id="password" name="password" class="form-control" required>
	</div>
	<input type="submit" value="Login" id="submit">
`

login_form.addEventListener("submit", (event) => {
	event.preventDefault();
	logIn(login_form);
});

signup_form.addEventListener("submit", (event) => {
	event.preventDefault();
	signUp(signup_form);
});

function toggleForm(id) {
	const form_div = document.getElementById("form_div");
	if (id === "login") {
		cleanElement(login_form);
		if (login_form.isConnected) {
			login_form.remove()
		} else {
			form_div.replaceChildren(login_form);
		}
	} else if (id === "signup") {
		cleanElement(signup_form)
		if (signup_form.isConnected) {
			signup_form.remove()
		} else {
			form_div.replaceChildren(signup_form);
		}
	}
}