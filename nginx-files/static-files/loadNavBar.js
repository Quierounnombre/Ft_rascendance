import getUser from "./getUser.js";

export default async function loadNavBar(loc) {
	const profile = await profileButton();
	if (profile === -1) {
		window.location.hash = "#anon-menu";
		return ;
	}

	const header = document.getElementById("header");
	header.innerHTML = `
<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand">Rascendance</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav" id="links">
        <a class="nav-link" href="#game">Game</a>
        <a class="nav-link" href="#social">Social</a>
        <a class="nav-link" href="#history">History</a>
      </div>
    </div>
  </div>
</nav>`;

	const links = header.getElementsByTagName("a");
	[...links].forEach(link => {
		if ("#" + link.innerText.toLowerCase() === loc) {
			link.setAttribute("class", "nav-link active");
		}
	});
	
	const bar = document.getElementById("links");
	bar.appendChild(profile);
}

async function profileButton() {
	const token = localStorage.getItem("token");
	if (!token) {
		return -1;
	}

	const user = await getUser(token);
	if (user === -1) {
		return -1;
	}

	document.getElementsByTagName("html")[0].style["font-size"] = user.font + "px";

	const profile = document.createElement("button");
	profile.setAttribute("class", "btn btn-secondary");
	profile.innerHTML = `
<div class="mini-cropped-image"><img src="` + user["avatar"] + `" alt="` + user["username"] + `'s profile picture" /></div>
Hi, `+ user["username"];

	profile.addEventListener("click", 
		() => {window.location.hash = "#profile"});

	return profile;
}
