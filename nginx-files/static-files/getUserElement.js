export default function getUserElement(user) {
	const emailField = document.createElement("div");
	emailField.setAttribute("class", "mb-3 row");
	emailField.innerHTML = `<label for="" data-i18n-key="prof-email" class="col-sm-2 form-label col-form-label">Email: </label>
		<div class="col-sm-10">
		<input type="text" readonly class="form-control-plaintext" id="email" name="email" value="`+ user["email"] +`">`;

	const usernameField = emailField.cloneNode(true);
	const fontField = document.createElement("div");
	fontField.setAttribute("class", "mb-3 row");
	fontField.innerHTML = `<label for="" data-i18n-key="prof-font" class="col-sm-2 form-label col-form-label">Font Size: </label>
		<div class="col-sm-10">
		<input type="number" readonly class="form-control-plaintext" id="font" name="font" min="11" max="33" value="`+ user["font"] +`">`;
	const languageField = document.createElement("div");
	languageField.setAttribute("class", "mb-3 row");
	languageField.innerHTML = `<label for="language" data-i18n-key="prof-lang" class="col-sm-2 form-label col-form-label">Language: </label>
		<div class="col-sm-10">
		<select disabled id="language" name="language">
            <option value="ENG">ENG</option>
            <option value="ESP">ESP</option>
            <option value="CAT">CAT</option>
        </select>`;

	usernameField.getElementsByTagName("label")[0].setAttribute('for', "username");

    usernameField.getElementsByTagName("label")[0].setAttribute('data-i18n-key', "prof-uname");

	usernameField.getElementsByTagName("label")[0].innerHTML="Username: ";

	usernameField.getElementsByTagName("input")[0].setAttribute('id', "username");

	usernameField.getElementsByTagName("input")[0].setAttribute('name', "username");

	usernameField.getElementsByTagName("input")[0].setAttribute('value', user["username"]);
    if (user["language"]==="ENG")
	languageField.getElementsByTagName("option")[0].setAttribute('selected', "");
    if (user["language"]==="ESP")
        languageField.getElementsByTagName("option")[1].setAttribute('selected', "");
    if (user["language"]==="CAT")
        languageField.getElementsByTagName("option")[2].setAttribute('selected', "");

	const avatar = document.createElement("div");
	avatar.setAttribute("class", "cropped-image mb-3");
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