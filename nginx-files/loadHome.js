const home = document.createElement("div");
home.innerHTML = `
<h1>Welcome to Rascendance</h1>
<button class=\"btn btn-secondary\" type=\"button\" onclick=\"window.location.hash=\'\#profile\'\">See your profile</button>
<button class=\"btn btn-secondary\" type=\"button\" onclick=\"window.location.hash=\'\#game\'\">Play a game</button>
<button class=\"btn btn-secondary\" type=\"button\" onclick=\"window.location.hash=\'\#chat\'\">Test websocket</button>
`;

function loadHome() {
	const root = document.getElementById("root");
	root.replaceChildren(home);
}

