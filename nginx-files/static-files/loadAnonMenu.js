export default  function loadAnonMenu() {
	const root = document.getElementById("root");
	const div = document.createElement("div");
	div.setAttribute("class", "container d-grid gap-5");

	const loginButton = document.createElement("button");
	loginButton.setAttribute("type", "button");
    
	const registerButton = loginButton.cloneNode();
	const OAuthButton = loginButton.cloneNode();

	loginButton.setAttribute("class", "btn btn-primary col-3");
    loginButton.setAttribute("style", "--bs-btn-font-size: 42px");
    loginButton.setAttribute("data-i18n-key", "log-button");
	registerButton.setAttribute("class", "btn btn-light btn-lg col-3");
    registerButton.setAttribute("style", "--bs-btn-font-size: 42px");
    registerButton.setAttribute("data-i18n-key", "reg-button");
	OAuthButton.setAttribute("class", "btn btn-dark btn-lg col-3");
	OAuthButton.setAttribute("disabled", "");
    OAuthButton.setAttribute("style", "--bs-btn-font-size: 42px");
    OAuthButton.setAttribute("data-i18n-key", "oauth-button");

	loginButton.innerHTML = "Log In";
	registerButton.innerHTML = "Register";
	OAuthButton.innerHTML = "With 42";

	loginButton.setAttribute("onclick", `window.location.hash='\#anon-login'`);
	registerButton.setAttribute("onclick", `window.location.hash='\#anon-register'`);

	div.appendChild(loginButton);
	div.appendChild(registerButton);
	div.appendChild(OAuthButton);

	root.replaceChildren(div);
}