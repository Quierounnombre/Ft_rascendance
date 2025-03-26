import searchUsers from "./searchUsers.js";

export default async function getHistoryTable(user, token) {
	const allUsers = await searchUsers("", token);
	const history = await getHistory(user.id);
	const historyTable = document.createElement("table");
	console.log(history);
}

async function getHistory(id) {
	const response = await fetch("https://" + window.location.hostname + ":7000/history/" + id, {
		method: "GET",
	});
	const data = await response.json();
	return data;
}