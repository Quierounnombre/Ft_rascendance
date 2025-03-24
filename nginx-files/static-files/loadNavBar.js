export default function loadNavBar(loc) {
	const header = document.getElementById("header");
	header.innerHTML = `
<nav class="navbar navbar-expand-lg fixed-topnavbar navbar-dark bg-dark">
  <div class="container">
    <a class="navbar-brand light"><h2>Rascendance</h2></a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse offcanvas-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav mr-auto">
        <a class="nav-link light" href="#game"><h2>Game</h2></a>
        <a class="nav-link light" href="#social"><h2>Friends</h2></a>
		<a class="nav-link light" href="#profile"><h2>Profile</h2></a>
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

}