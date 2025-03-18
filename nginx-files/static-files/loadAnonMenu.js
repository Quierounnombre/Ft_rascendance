export default  function loadAnonMenu() {
	const root = document.getElementById("root");
	const div = document.createElement("div");
	div.setAttribute("class", "container d-grid gap-2");

	const loginButton = document.createElement("button");
	loginButton.setAttribute("type", "button");
	const registerButton = loginButton.cloneNode();
	const OAuthButton = loginButton.cloneNode();

	loginButton.setAttribute("class", "btn btn-primary");
	registerButton.setAttribute("class", "btn btn-outline-primary");
	OAuthButton.setAttribute("class", "btn btn-info");
	OAuthButton.setAttribute("disabled", "");

	loginButton.innerHTML = "Log In";
	registerButton.innerHTML = "Register";
	OAuthButton.innerHTML = "OAuth";

	loginButton.setAttribute("onclick", `window.location.hash='\#anon-login'`);
	registerButton.setAttribute("onclick", `window.location.hash='\#anon-register'`);

	div.appendChild(loginButton);
	div.appendChild(registerButton);
	div.appendChild(OAuthButton);

	root.replaceChildren(div);
}