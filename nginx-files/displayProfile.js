async function displayProfile(token) {
	const user = await getUsers(token);
	console.log(user);
	return (formatTable(user));
}

async function getUsers(token) {
	try {
		const response = await fetch("http://localhost:8080/profile/me/", {
			method: "GET",
			headers: {
				"Authorization": "Token " + token,
			}
		});
		const data = await response.json();
		return data;
	} catch (e) {
		console.error(e);
	}
}

function formatTable(jsonData) {
	console.log(jsonData)

	var table = "<h2>Hi, " + jsonData["username"] + 
	"<img src=\"" + jsonData["avatar"] + "\" class=\"img-thumbnail\" style=\"width:100px\" />\
	</h2>\
	<table class=\"table\">\
  <tbody>";

	for (let i in jsonData) {
		if (i !== "email" && i !== "username" && i !== "font" && i !== "language") { continue; };
		table = table + "<tr>\n" +
			"<th scope=\"row\">" + i + "</th>\n" +
			"<td>" + jsonData[i] + "</td>\n" +
			"</tr>";
	}
	table + "</tbody></table>";
	return table;
}