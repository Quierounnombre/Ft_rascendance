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
	"<img src=\"" + jsonData["avatar"] + "\" class=\"img-thumbnail\" style=\"max-width:100px\" />\
	</h2>\
	<form id=\"profile\">";

	for (let i in jsonData) {
		if (i !== "email" && i !== "username" && i !== "font" && i !== "language") { continue; };
		table += `<div class="mb-3 row">
    	<label for="` + i + 
		`" class="col-sm-2 col-form-label">`+ i + 
		`</label><div class="col-sm-10"><input type="text" readonly class="form-control-plaintext" id="`+ i + 
		`" value="` + jsonData[i] +
		`"></div></div>`;
	}
	table += "</form>";
	return table;
}