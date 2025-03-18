const roomSelector = document.createElement("div");
roomSelector.setAttribute("class", "container");

roomSelector.innerHTML = `Enter a room name:<br>
<input id="room-name-input" type="text" size="100"><br>
    <input id="room-name-submit" type="button" onclick="goToRoom()" value="Enter">`

export default function loadChat() {
	const root = document.getElementById("root");
	root.replaceChildren(roomSelector);
}

