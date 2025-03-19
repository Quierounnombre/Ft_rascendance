// hay token y funciona ? cargar home : cargar login

"use strict";
import loadAnonHeader from "./loadAnonHeader.js";
import loadAnonMenu from "./loadAnonMenu.js";
import loadLogin from "./loadLogin.js";
import loadRegister from "./loadRegister.js";
import loadNavBar from "./loadNavBar.js";
import loadSocial from "./loadSocial.js";

function changeLayout() {
	var loc = window.location.hash;

	const token = localStorage.getItem("token");
	
	if (!token && !loc.startsWith("#anon-")) {
		loc = "#anon-menu"
	} //comprobar que es valido
				
	if (loc == "") {
		loc = "#game"
	}

	if (loc.startsWith("#anon-")) {
		loadAnonHeader();
		if (loc === "#anon-login") {
			loadLogin();
		} else if (loc === "#anon-register") {
			loadRegister();
		} else {
			loadAnonMenu();
		}
		// else error
	} else {
		loadNavBar(loc);
		if (loc === "#social") {
			loadSocial();
		}
		// loadGame();
	}
}

window.addEventListener("hashchange", changeLayout);

changeLayout();