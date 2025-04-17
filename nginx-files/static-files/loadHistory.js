import getHistoryTable from "./getHistoryTable.js";
import getUser from "./getUser.js";
import translatePage from "./translate.js";
import {getCookie} from "./cookiesManagement.js"

export default function loadHistory() {
	const token = getCookie("token");
	if (!token) {
		window.location.hash = "";
		return ;
	}
	const back = document.createElement("a");
	back.setAttribute("href", "#profile");
	back.innerHTML='<i class="bi bi-arrow-left-circle-fill" style="font-size:3rem; color:blue"></i>'

	getUser(token).then((user) => {
		getHistoryTable(user, token).then((table) => {
			document.getElementById("root").replaceChildren(table);
			document.getElementById("root").appendChild(back);
			translatePage();
	})});

}
