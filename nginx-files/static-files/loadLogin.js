export default function loadLogin() {
	const root = document.getElementById("root");

	const form = document.createElement("form");
	form.setAttribute("class", "container-xl");
	form.setAttribute("id", "login_form");
	form.innerHTML = `
	<div class="mb-3">
		<label for="email" class="form-label">Email:</label>
		<input type="email" id="email" name="email" class="form-control" required />
	</div>
	<div class="mb-3">
		<label for="password" class="form-label">Password:</label>
		<input type="password" id="password" name="password" class="form-control" required />
	</div>
	<input type="submit" value="Login" id="submit" />
	<button onclick="window.location.hash='\#anon-menu'">Go back</button>`;

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		logIn(form);
	});

	root.replaceChildren(form);
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
			validLogin(data.token, data.font);
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

function validLogin(token, font) {
	localStorage.setItem("token", token);
	document.getElementsByTagName( "html" )[0].style[ "font-size" ] = font + "px";
	window.location.hash='';
}