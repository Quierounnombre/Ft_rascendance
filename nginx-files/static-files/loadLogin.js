import getUser from  "./getUser.js"
import load2FA from "./load2FA.js";

export default function loadLogin() {
	const root = document.getElementById("root");

	const form = document.createElement("form");
	form.setAttribute("class", "container-xl");
	form.setAttribute("id", "login_form");
	form.innerHTML = `
	<div id="liveAlertPlaceholder"></div>
	<div class="mb-3">
		<label for="email" class="form-label">Email:</label>
		<input type="email" id="email" name="email" class="form-control" required />
	</div>
	<div class="mb-3">
		<label for="password" data-i18n-key="login-pass" class="form-label">Password:</label>
		<input type="password" id="password" name="password" class="form-control" required />
	</div>
	<input type="submit" data-i18n-key="login-sub" value="Login" id="submit" />
	<button data-i18n-key="login-out" onclick="window.location.hash='\#anon-menu'">Go back</button>`;

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		logIn(form);
	});

	root.replaceChildren(form);
}

async function logIn(form) {
	const formData = new FormData(form);

	try {
		const response = await fetch("https://" + window.location.hostname + ":" + window.location.port + "/profile/login/", {
			method: "POST",
			body: formData,
		});
		if (!response.ok) {
			invalidLogin(data);
			const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
			const wrapper = document.createElement('div')
			wrapper.innerHTML = [
	  `<div class="alert alert-danger alert-dismissible" role="alert">`,
	  `   <div>Invalid Login, please try again</div>`,
	  '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
	  '</div>'
		].join('')
  
		alertPlaceholder.append(wrapper)
		} else {
			load2FA(formData.get("email"));
		}
	} catch (e) {
		console.error(e);
	}
}

function invalidLogin(data) {
	const form = document.getElementById("login_form");
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
