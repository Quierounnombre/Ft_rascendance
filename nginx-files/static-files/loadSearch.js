export default async function loadSearch() {
	const button = document.getElementById("search-button");
	const query = button.value;
	const users = await searchUsers(query);
	const root = document.getElementById("root");
	console.log(users);
	const div = document.createElement("div");
	div.innerHTML = "Esto no esta implementado todavia";
	root.replaceChildren(div);
}

async function searchUsers(query) {
  	const response = await fetch("https://" + window.location.hostname + ":7000/profile/users?search=" + query, {
        method: "GET",
    });
	const data = await response.json();
	return data;
}