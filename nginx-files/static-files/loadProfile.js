export default function loadProfile() {
	const div = document.createElement("div");
	const root = document.getElementById("root");
	div.innerHTML = "This is your Profile";
	root.replaceChildren(div);
}