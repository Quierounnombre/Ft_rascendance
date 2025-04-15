import translatePage from "./translate.js";
import getUser from "./getUser.js";

export default function load2FA(email) {
    const window2FA = document.createElement("form");
    window2FA.setAttribute("id", "2fa");
    window2FA.innerHTML = `
	<div id="liveAlertPlaceholder"></div>
    <div class="mb-3">
		<label for="code" data-i18n-key="2fa-code" class="form-label">We sent a code your email to validate your identity. Please, check your spam:</label>
		<input type="text" id="code" name="code" class="form-control" required />
	</div>
	<input type="submit" data-i18n-key="2fa-sub" value="Send" id="submit" />
    `

    window2FA.addEventListener("submit", (event) => {
        event.preventDefault();
        validate2FA(window2FA, email);
    })

    document.getElementById("root").replaceChildren(window2FA);
    translatePage();
}

async function validate2FA(form, email) {
    const formData = new FormData(form);
    formData.append("email", email);
	try {
		const response = await fetch("https://" + window.location.hostname + ":" + window.location.port + "/profile/generate_token/", {
			method: "POST",
			body: formData,
		});
		const data = await response.json();
		if (!response.ok) {
			const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
			const wrapper = document.createElement('div')
			wrapper.innerHTML = [
	  `<div class="alert alert-danger alert-dismissible" role="alert">`,
	  `   <div>Invalid code</div>`,
	  '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
	  '</div>'
		].join('')
  
		alertPlaceholder.append(wrapper)
		} else {
			validLogin(data.token, data.font);
		}
	} catch (e) {
		console.error(e);
	}
}

async function validLogin(token, font) {
	localStorage.setItem("token", token);
    const user = await getUser(token);
    localStorage.setItem("language", user["language"]);
    console.log(user["language"]);
	document.getElementsByTagName( "html" )[0].style[ "font-size" ] = font + "px";
	window.location.hash='';
	const switcher = document.getElementById("lang-switcher");
    if (!switcher)
        return ;
	switcher.value = user["language"];
}