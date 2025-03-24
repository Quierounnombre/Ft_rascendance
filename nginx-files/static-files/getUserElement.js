export default function getUserElement(user) {
	const emailField = document.createElement("div");
	emailField.setAttribute("class", "mb-3 row");
	emailField.innerHTML = `<label for="" class="col-sm-2 col-form-label">Email: </label>
		<div class="col-sm-10">
		<input type="text" readonly class="form-control-plaintext" id="email" name="email" value="`+ user["email"] +`">`;

	const usernameField = emailField.cloneNode(true);
	const fontField = emailField.cloneNode(true);
	const languageField = emailField.cloneNode(true);

	usernameField.getElementsByTagName("label")[0].setAttribute('for', "username");
	fontField.getElementsByTagName("label")[0].setAttribute('for', "font");
	languageField.getElementsByTagName("label")[0].setAttribute('for', "language");

	usernameField.getElementsByTagName("label")[0].innerHTML="Username: ";
	fontField.getElementsByTagName("label")[0].innerHTML="Font size:";
	languageField.getElementsByTagName("label")[0].innerHTML="Language: ";

	usernameField.getElementsByTagName("input")[0].setAttribute('id', "username");
	fontField.getElementsByTagName("input")[0].setAttribute('id', "font");
	languageField.getElementsByTagName("input")[0].setAttribute('id', "language");

	usernameField.getElementsByTagName("input")[0].setAttribute('name', "username");
	fontField.getElementsByTagName("input")[0].setAttribute('name', "font");
	languageField.getElementsByTagName("input")[0].setAttribute('name', "language");
	
	usernameField.getElementsByTagName("input")[0].setAttribute('value', user["username"]);
	fontField.getElementsByTagName("input")[0].setAttribute('value', user["font"]);
	languageField.getElementsByTagName("input")[0].setAttribute('value', user["language"]);

	const avatar = document.createElement("div");
	avatar.setAttribute("class", "cropped-image");
	avatar.innerHTML = `<img src="` + user["avatar"] + `" alt="` + user["username"] + `'s profile picture" />`;

	const form = document.createElement("form");
	form.setAttribute("id", "profile");

	form.appendChild(avatar);
	form.appendChild(emailField);
	form.appendChild(usernameField);
	form.appendChild(fontField);
	form.appendChild(languageField);
	return form;
}