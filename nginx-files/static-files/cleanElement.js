function cleanElement(element) {
	const fields = element.getElementsByTagName("input");
	for (let i = 0; i < fields.length; i++) {
		if (fields[i].type === "submit") {
			continue;
		}
		fields[i].value = "";
		fields[i].classList.remove("is-invalid");
		fields[i].classList.remove("is-valid");
	}
}