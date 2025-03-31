import getUser from "./getUser.js";
import translatePage from "./translate.js";

export default async function loadNavBar(loc) {
    const profile = await profileButton();
	if (profile === -1) {
		window.location.hash = "#anon-menu";
        return ;
    }
	const header = document.getElementById("header");
	header.innerHTML = `
<nav class="navbar navbar-expand-lg fixed-topnavbar navbar-dark bg-dark">
  <div class="container">
    <a class="navbar-brand light"><h1>Rascendance🏓</h1></a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse col-lg-auto navbar-collapse justify-content-center offcanvas-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav mr-auto" id="links">
        <a class="nav-link light" href="#game"><h2 data-i18n-key="navbar-game">Game</h2></a>
        <a class="nav-link light"  href="#social"><h2 data-i18n-key="navbar-social">Social</h2></a>
		<a class="nav-link light"  href="#profile"><h2 data-i18n-key="navbar-profile">Profile</h2></a>
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
    translatePage();
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
	const profile = document.createElement("span");
	profile.setAttribute("class", "badge bg-secondary");
	profile.innerHTML = `
<div class="mini-cropped-image"><img class="rounded-circle me-1" width="32" height="32" src="` + user["avatar"] + `" alt="` + user["username"] + `'s profile picture" /> <b data-i18n-key="badge-hi">Hi</b> `+ user["username"] +` !</div>`;

	profile.addEventListener("click", 
		() => {window.location.hash = "#profile"});

	return profile;
}
