const home = document.createElement("div");
home.innerHTML = `
<h1>Welcome to Rascendance</h1>
<div class="search-container input-group">
<input type="text" id="search-box" class="form-control search-input" placeholder="Search other users">
<button class="btn btn-outline-secondary" onclick="loadSearch()"><i class="bi bi-search"></i></button>
</div>
<button class=\"btn btn-secondary\" type=\"button\" onclick=\"window.location.hash=\'\#profile\'\">See your profile</button>
<button class=\"btn btn-secondary\" type=\"button\" onclick=\"window.location.hash=\'\#game\'\">Play a game</button>
<button class=\"btn btn-secondary\" type=\"button\" onclick=\"window.location.hash=\'\#chat\'\">Test websocket</button>
`;

export default function loadHome() {
	const root = document.getElementById("root");
	root.replaceChildren(home);
}

