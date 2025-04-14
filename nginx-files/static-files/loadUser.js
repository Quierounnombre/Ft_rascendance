import getHistoryTable from "./getHistoryTable.js";
import getUserElement from "./getUserElement.js";
import searchUsers from "./searchUsers.js";
import translatePage from "./translate.js";

export default async function loadUser() {
	const id = localStorage.getItem("user_id");
	const token = localStorage.getItem("token");
	if (!id || !token) {
		window.location.hash = "#social";
		return ;
	}
	
	const users = await searchUsers("", token);
	const user = users.filter((element) => element.id == id);

	const userElement = getUserElement(user[0]);
	const root = document.getElementById("root");
	root.replaceChildren(userElement);
	getHistoryTable(user[0], localStorage.getItem("token")).then((table) => {
		root.appendChild(table);
	})
	translatePage();
}