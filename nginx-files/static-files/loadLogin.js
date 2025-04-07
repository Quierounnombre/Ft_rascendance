import getUser from  "./getUser.js"

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
		const response = await fetch("https://" + window.location.hostname + ":7000/profile/login/", {
			method: "POST",
			body: formData,
		});
		const data = await response.json();
		if (!response.ok) {
			invalidLogin(data);
		} else {
			validLogin(data.token, data.font);
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
	
	const alert = document.createElement("div");
	alert.setAttribute("class", "alert alert-danger alert-dismissible fade show");
	alert.setAttribute("role", "alert");
	alert.innerHTML= `
<strong>Error: </strong>`+ data.error +`
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
	`
	const root = document.getElementById("root");
	root.insertAdjacentElement("afterbegin", alert);
}

async function validLogin(token, font) {
	localStorage.setItem("token", token);
    const user = await getUser(token);
    localStorage.setItem("language", user["language"]);
	document.getElementsByTagName( "html" )[0].style[ "font-size" ] = font + "px";
	window.location.hash='';
	const switcher = document.getElementById("lang-switcher");
    if (!switcher)
        return ;
	switcher.value = user["language"];
}