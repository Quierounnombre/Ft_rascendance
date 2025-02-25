function toggleForm() {
	const form = document.getElementById("my_form");
	if (form.hasAttribute("hidden")) {
		form.removeAttribute("hidden");
	} else {
		form.setAttribute("hidden", "");
	}
}