import getHistoryTable from "./getHistoryTable.js";
import getUser from "./getUser.js";
import translatePage from "./translate.js";

export default function loadHistory() {
	const root = document.getElementById("root");
	const token = localStorage.getItem("token");
	if (!token) {
		window.location.hash = "";
		return ;
	}

	getUser(token).then((user) => {
		getHistoryTable(user, token).then((table) => {
			translatePage();
	})});

}
