export default function loadNavBar(loc) {
	const header = document.getElementById("header");
	header.innerHTML = `
<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand">Rascendance</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav">
        <a class="nav-link" href="#game">Game</a>
        <a class="nav-link" href="#social">Social</a>
        <a class="nav-link" href="#history">History</a>
		<a class="nav-link" href="#profile">Profile (this should be different)></a>
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

// hacer una llamada para poner el perfil y coger el tamaño de letra
