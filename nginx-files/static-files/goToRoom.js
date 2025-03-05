const room = document.createElement("div");
room.setAttribute("class", "container");

room.innerHTML = `<textarea id="chat-log" cols="100" rows="20"></textarea><br>
    <input id="chat-message-input" type="text" size="100"><br>
    <input id="chat-message-submit" type="button" value="Send">`

async function getUsername() {
	var user;
	token = localStorage.getItem("token");
	if (!token)
		return "anon";
	else
		user = await getUsers(token);
	return user["username"];
}

async function goToRoom() {
	const roomName = document.getElementById("room-name-input").value;
	const root = document.getElementById("root");
	const username = await getUsername();
	const chatSocket = new WebSocket(
		'wss://'
		+ window.location.hostname
		+ ":7000"
		+ '/ws/chat/'
		+ roomName
		+ '/'
	);

	root.replaceChildren(room);
	
	chatSocket.onmessage = function(e) {
		const data = JSON.parse(e.data);
		document.getElementById('chat-log').value += (data.message + '\n');
	};
		
	chatSocket.onclose = function(e) {
			console.error('Chat socket closed unexpectedly');
	};
			
	document.getElementById("chat-message-submit").onclick = function sendMsg() {
		const inputMsg = document.getElementById("chat-message-input");
		const message = inputMsg.value;
		chatSocket.send(JSON.stringify({
			'message': username + " said: " + message
		}));
		inputMsg.value = '';
	}
}

