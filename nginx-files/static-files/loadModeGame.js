const gameSelector = document.createElement("div");
gameSelector.setAttribute("id", "canvas_container");
gameSelector.setAttribute("class", "container");
gameSelector.innerHTML = `
<h2 data-i18n-key="game-mode">Create room</h2>
    <div class="row">
        <div class="col border border-5 border-info-subtle rounded-pill p-4 text-center me-3" style="background-color: lightskyblue; padding:30px">
        <a class="link-offset-2 link-underline link-underline-opacity-0" href="#form-tourn">
        <i class="bi bi-trophy-fill" style="font-size:12rem; color:blue"></i>
        <p data-i18n-key="mod-tourn" style="color: blue; font-size:2rem;">Tournament</p>
        </a>
        </div>
        <div class="col border border-5 border-info-subtle rounded-pill p-4 text-center me-3" style="background-color: lightskyblue; padding:33px">
        <a class="link-offset-2 link-underline link-underline-opacity-0" href="#form-online">
        <i class="bi bi-globe2" style="font-size:12rem; color:blue"></i>
        <p style="color: blue; font-size:2rem;">Online</p>
        </a>
        </div>
        <div class="col border border-5 border-info-subtle rounded-pill p-4 text-center" style="background-color: lightskyblue; padding:33px">
        <a class="link-offset-2 link-underline link-underline-opacity-0" href="#form-local">
        <i class="bi bi-house-fill" style="font-size:12rem; color:blue"></i>
        <p style="color: blue; font-size:2em;">Local</p>
        </a>
        </div>
    </div>
<div>
<h2 data-i18n-key="join-room">Join room</h2>
<form id="dataForm2" class="container">
	<div class="form-floating">
		<input required name="room_name2" id="room_name2" type="text" class="form-control" size="100">
		<label class="form-label" for="room_name2" data-i18n-key="join-form">Join pong room</label>
	</div>
	<button type="submit" name="submit" data-i18n-key="join-submit" id="submit" class="btn btn-primary">Submit</button>
</form>
</div>
`;

export default function loadModeGame() {
    const root = document.getElementById("root");
	root.replaceChildren(gameSelector);


}