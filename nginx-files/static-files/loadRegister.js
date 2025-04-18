import getUser from  "./getUser.js"
import load2FA from "./load2FA.js";
import translatePage from "./translate.js";

export default function loadRegister() {
	const root = document.getElementById("root");

	const form = document.createElement("form");
	form.setAttribute("class", "container-xl");
	form.setAttribute("id", "signup_form");
	form.innerHTML = `
	<div id="liveAlertPlaceholder"></div>
	<div class="mb-3">
		<label for="email" class="form-label">Email:</label>
		<input type="email" id="email" name="email" class="form-control" required/>
	</div>
	<div class="mb-3">
		<label for="username" data-i18n-key="reg-usname" class="form-label">Username:</label>
		<input type="text" id="username" name="username" class="form-control" required/>
	</div>
	<div class="mb-3">
		<label for="first_name" data-i18n-key="reg-finame" class="form-label">First Name:</label>
		<input type="text" id="first_name" name="first_name" class="form-control" required/>
	</div>
	<div class="mb-3">
		<label for="last_name" data-i18n-key="reg-laname" class="form-label">Last Name:</label>
		<input type="text" id="last_name" name="last_name" class="form-control" required/>
	</div>
	<div class="mb-3">
		<label for="password" data-i18n-key="reg-pass" class="form-label">Password:</label>
		<input type="password" id="password" name="password" class="form-control" required/>
	</div>
	<div class="mb-3">
		<label for="password2" data-i18n-key="reg-pass2" class="form-label">Repeat Password:</label>
		<input type="password" id="password2" name="password2" class="form-control" required/>
	</div>
	<input type="submit" data-i18n-key="reg-sub" value="Sign Up" id="submit"/>
	<button  data-i18n-key="login-out" onclick="window.location.hash='\#anon-menu'">Go back</button>
	`;

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		signUp(form);
	});

	root.replaceChildren(form);
}

async function signUp(form) {
	const formData = new FormData(form);

	try {
		const response = await fetch("https://" + window.location.hostname + ":" + window.location.port + "/profile/singup/", {
			method: "POST",
			body: formData,
		});
		const data = await response.json();
		if (response.ok) {
			load2FA(data.user.email);
		} else {
			invalidLogin();
			const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
			  const wrapper = document.createElement('div')
				  wrapper.innerHTML = [
			`<div class="alert alert-danger alert-dismissible" role="alert">`,
				`    <div data-i18n-key="invalid-regis">Invalid Register, please try again</div>`,
				'   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
			'</div>'
			  ].join('')
	
			  alertPlaceholder.append(wrapper)
			  translatePage();
		}
	} catch (e) {
		console.error(e);
	}
}

function invalidLogin() {
	const form = document.getElementById("signup_form");
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

