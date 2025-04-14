import searchUsers from "./searchUsers.js";

export default async function getHistoryTable(user, token) {
	const allUsers = await searchUsers("", token);
	const history = await getHistory(user, allUsers);

	const historyTable = document.createElement("table");
	historyTable.setAttribute("class", "table");
	const tableHeader = document.createElement("tr");
	const h1 = document.createElement("th");
	const h2 = h1.cloneNode(true);
	h2.innerHTML = "Participants";
	h2.setAttribute("data-i18n-key", "hist-par");
	const h3 = h1.cloneNode(true);
	h3.innerHTML = "Result";
	h3.setAttribute("data-i18n-key", "hist-res");
	const h4 = h1.cloneNode(true);
	h4.innerHTML = "Time";
	h4.setAttribute("data-i18n-key", "hist-tim");
	const h5 = h1.cloneNode(true);
	h5.innerHTML = "Date";
	h5.setAttribute("data-i18n-key", "hist-dat");
	tableHeader.appendChild(h1);
	tableHeader.appendChild(h2);
	tableHeader.appendChild(h3);
	tableHeader.appendChild(h4);
	tableHeader.appendChild(h5);
	historyTable.appendChild(tableHeader);
	const tableBody = document.createElement("tbody");
	
	history.forEach(match => {
		const row = document.createElement("tr");
		if (match.status === "WIN!")
			row.setAttribute("class", "table-info");
		if (match.status === "LOSE!")
			row.setAttribute("class", "table-danger");
		if (match.status === "TIE!")
			row.setAttribute("class", "table-warning");
		row.innerHTML = `
		<th data-i18n-key="`+ match.status + `">`+ match.status +`</th>
		<td>`+ match.player1_id + ` vs ` + match.player2_id +`</td>
		<td>`+ match.player1_score + `-` + match.player2_score +`</td>
		<td>`+ Math.trunc((match.duration / 60) % 60) + `:` + Math.trunc(match.duration % 60) +`</td>
		<td>`+ match.date +`</td>
		`;
		tableBody.appendChild(row);
	})
	historyTable.appendChild(tableBody);
	return historyTable;
}

async function getHistory(user, userList) {
	const response = await fetch("https://" + window.location.hostname + ":" + window.location.port + "/history/" + user.id, {
		method: "GET",
	});
	const data = await response.json();
	data.forEach(match => {
		if (match.player1_id === user.id) {
			match.player1_id = user.username;
			match.player2_id = userList.find((u) => u.id === match.player2_id).username;
			if (match.player1_score > match.player2_score)
				match["status"] = "WIN!";
			else if (match.player1_score < match.player2_score)
				match["status"] = "LOSE!";
			else
				match["status"] = "TIE!";
		} else {
			match.player2_id = user.username;
			match.player1_id = userList.find((u) => u.id === match.player1_id).username;
			if (match.player2_score > match.player1_score)
				match["status"] = "WIN!";
			else if (match.player2_score < match.player1_score)
				match["status"] = "LOSE!";
			else
				match["status"] = "TIE!";
		}
	});
	return data;
}
