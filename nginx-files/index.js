"use strict";

let token;
function changeLayout() {
	var loc = window.location.hash;
	if (loc == "") {
		loc = "#home"
	}

	if (loc === "#home") {
		loadHome();
	} else if (loc === "#profile") {
		loadProfile();
	} else {
		loadGame();
	}
}

window.addEventListener("hashchange", changeLayout);

changeLayout();