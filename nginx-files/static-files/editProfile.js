import translatePage from "./translate.js";

export default function editProfile() {
    const submitButton = document.createElement("input");
submitButton.setAttribute("type", "submit");
submitButton.setAttribute("value", "Save Changes");
submitButton.setAttribute("class", "btn btn-lg btn-primary mb-2")
submitButton.setAttribute("data-i18n-key", "edit-sub")
submitButton.setAttribute("id", "submit");
    const avatar_field = document.createElement("div");
avatar_field.setAttribute("class", "mb-3 row");
avatar_field.innerHTML = `<label data-i18n-key="prof-avatar" for="avtar" class="col-sm-2 form-label col-form-label">Change Avatar:</label>
		<div class="col-sm-10"><input type="file" accept=".jpg,.gif,.png,.webp" class="form-control" id="avtar" name="avatar"</div>`

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
	const token = localStorage.getItem("token");
	const switcher = document.getElementById("lang-switcher");
	try {
		fetch("https://" + window.location.hostname + ":7070/profile/me/", {
			method: "PUT",
			headers: {
				"Authorization": "Token " + token,
			},
			body: formData,
		}).then((response) => {
			response.json().then((data) => {
				document.getElementsByTagName("html")[0].style["font-size"] = data.font + "px";
                localStorage.setItem("language", data.language);
				if (switcher)
					switcher.value = data.language;
			});
			var event = new Event('hashchange');
			window.dispatchEvent(event);
		})
	} catch (e) {
		console.error(e);
	}
    document.getElementById("edit_button").toggleAttribute("disabled");
}