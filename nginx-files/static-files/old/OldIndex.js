import loadHome from "./loadHome.js";
import loadGame from "./loadGame.js";
import loadProfile from "./loadProfile.js";
import loadChat from "./loadChat.js";
import loadSearch from "./loadSearch.js";
"use strict";

function changeLayout() {
	var loc = window.location.hash;
	if (loc == "") {
		loc = "#home"
	}

	if (loc === "#home") {
		loadHome();
	} else if (loc === "#profile") {
		loadProfile();
	} else if (loc === "#chat") {
		loadChat();
	} else if (loc === "#search") {
		loadSearch();
	}
	else {
		loadGame();
	}
}

window.addEventListener("hashchange", changeLayout);

changeLayout();