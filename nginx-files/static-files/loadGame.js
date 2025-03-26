export default function loadGame() {
	const div = document.createElement("div");
	const root = document.getElementById("root");
	div.innerHTML = "This is to play";
	root.replaceChildren(div);
}