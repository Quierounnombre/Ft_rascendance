function seeProfile() {
	const display = document.getElementById("my_token");
	if (!token)
		display.innerHTML = "You are not logged!";
	else
		display.innerHTML = displayUsers();
}

function displayUsers() {
	return formatTable(users);
}

async function getUsers() {
	try {
		const response = await fetch("http://localhost:8080/me/", {
			method: "GET",
			headers: {
				"Authorization": "Token " + token,
			}
		});
		const data = await response.json();
		users = data;
	} catch (e) {
		console.error(e);
	}
}

function formatTable(jsonData) {
	console.log(jsonData)

	var table = "<h2>Hi, " + jsonData["username"] + "</h2>\
	<table class=\"table\">\
  <tbody>";

	for (let i in jsonData) {
		if (i !== "email" && i !== "username") { continue; };
		table = table + "<tr>\n" +
			"<th scope=\"row\">" + i + "</th>\n" +
			"<td>" + jsonData[i] + "</td>\n" +
			"</tr>";
	}
	table + "</tbody></table>";
	return table;
}