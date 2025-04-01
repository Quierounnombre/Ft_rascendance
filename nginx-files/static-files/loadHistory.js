export default function loadHistory() {
	const div = document.createElement("div");
	const root = document.getElementById("root");
	div.innerHTML = "This is History";
	root.replaceChildren(div);
}