"use strict";
import loadAnonHeader from "./loadAnonHeader.js";
import loadAnonMenu from "./loadAnonMenu.js";
import loadLogin from "./loadLogin.js";
import loadRegister from "./loadRegister.js";
import loadNavBar from "./loadNavBar.js";
import loadSocial from "./loadSocial.js";
import loadSearch from "./loadSearch.js";
import loadHistory from "./loadHistory.js";
import loadProfile from "./loadProfile.js";
import loadUser from "./loadUser.js";
import loadFooter from "./loadFooter.js";
import bindLocaleSwitcher from "./translate.js";
import loadModeGame from "./loadModeGame.js";
import loadLocal from "./loadLocal.js";
import loadOnline from "./loadOnline.js";
import loadTournament from "./loadTournament.js";
import {getCookie} from "./cookiesManagement.js"

function changeLayout() {
	var loc = window.location.hash;
	const defaultLocale = "ENG";
	const token = getCookie("token");
	const lang = localStorage.getItem("language");
	if (!lang)
	localStorage.setItem("language", defaultLocale);
	
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
		if (loc === "#form-local") {
			loadLocal();
		} else if (loc === "#form-online") {
			loadOnline();
		} else if (loc === "#form-tourn") {
			loadTournament();
		} else if (loc === "#social") {
			loadSocial();
		} else if (loc === "#search") {
			loadSearch();
		} else if (loc === "#history") {
			loadHistory();
        }
        else if (loc === "#profile") {
			loadProfile();
		} else if (loc === "#user") {
			loadUser();
		} else {
			loadModeGame();
		}
  
	}
    bindLocaleSwitcher();

}
loadFooter();
window.addEventListener("hashchange", changeLayout);
changeLayout();

