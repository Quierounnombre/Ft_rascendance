import translatePage from "./translate.js";
import {getCookie} from "./cookiesManagement.js"
import put_alert from "./put_alert.js"

export default function editProfile() {
    const submitButton = document.createElement("input");
submitButton.setAttribute("type", "submit");
submitButton.setAttribute("value", "Save Changes");
submitButton.setAttribute("class", "btn btn-lg btn-secondary mb-2")
submitButton.setAttribute("data-i18n-key", "edit-sub")
submitButton.setAttribute("id", "submit");
    const avatar_field = document.createElement("div");
avatar_field.setAttribute("class", "mb-3 row");
avatar_field.innerHTML = `<label data-i18n-key="prof-avatar" for="avtar" class="col-sm-2 form-label col-form-label">Change Avatar:</label>
		<div class="col-sm-10"><input type="file" accept=".jpg,.gif,.png,.webp" class="form-control" id="avatar" name="avatar"</div>`

	const form = document.getElementById("profile");
	const fields = form.getElementsByTagName("input");

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		saveChanges();
	});

	[...fields].forEach(field => {
		if (field.name !== "email" && field.id !== "submit") {
			if (field.type !== "color")
				field.setAttribute("class", "form-control");
			field.removeAttribute("readonly");
			field.removeAttribute("disabled");
		}
	});

    const select = form.getElementsByTagName("select");
    select[0].removeAttribute("disabled");

    document.getElementById("edit_button").toggleAttribute("disabled");
	form.appendChild(avatar_field);
	form.appendChild(submitButton);
	translatePage();
}

function saveChanges() {
	const form = document.getElementById("profile");
	const formData = new FormData(form);
	const token = getCookie("token");
	const switcher = document.getElementById("lang-switcher");
	try {
		fetch("https://" + window.location.hostname + ":" + window.location.port + "/profile/me/", {
			method: "PUT",
			headers: {
				"AUTHORIZATION": "Bearer " + token,
			},
			body: formData,
		}).then((response) => {
			if (response.status == 413) {
				put_alert("big-img", "Image is too big");
				document.getElementById("avatar").value = "";

			} else {
				response.json().then((data) => {
				if (response.ok) {
					document.getElementsByTagName("html")[0].style["font-size"] = data.font + "px";
                	localStorage.setItem("language", data.language);
					if (switcher)
						switcher.value = data.language;
					var event = new Event('hashchange');
					window.dispatchEvent(event);
				} else {
					for (let i in data) {
						put_alert(i+"-ERROR", "");
					}
				}})
		
			}});
			translatePage();
	} catch (e) {
		console.error(e);
	}
    document.getElementById("edit_button").toggleAttribute("disabled");
}