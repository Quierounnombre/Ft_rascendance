const game = document.createElement("div");
game.setAttribute("class", "container");
const room = game.cloneNode();

game.innerHTML = `Enter a room name:<br>
<input id="room-name-input" type="text" size="100"><br>
    <input id="room-name-submit" type="button" onclick="goToRoom()" value="Enter">`

room.innerHTML = `<textarea id="chat-log" cols="100" rows="20"></textarea><br>
    <input id="chat-message-input" type="text" size="100"><br>
    <input id="chat-message-submit" type="button" value="Send">`

export default function loadChat() {
	const root = document.getElementById("root");
	root.replaceChildren(game);
}

