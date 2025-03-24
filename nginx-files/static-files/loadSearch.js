import getMyFriends from "./getMyFriends.js";

export default async function loadSearch() {
	const button = document.getElementById("search-box");
	if (!button) {
		window.location.hash = "#social";
		return ;
	}
	const query = button.value;
	const token = localStorage.getItem("token");
	if (!token) {
		window.location.hash = "#anon-menu";
		return ;
	}
	const users = await searchUsers(query, token);
	const userList = await usersList(users);
	if (userList === -1) {
		return ;
	}
    
	const root = document.getElementById("root");
	root.replaceChildren(userList);
}

async function searchUsers(query, token) {
  	const response = await fetch("https://" + window.location.hostname + ":7000/profile/users?search=" + query, {
        method: "GET",
		headers: {
			"Authorization": "Token " + token,
		}
    });
	const data = await response.json();
	return data;
}

async function usersList(users) {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.hash = "#anon-menu";
        return -1;
    }
    const friends = await getMyFriends(token)
    const userList = document.createElement("div");
	if (users.length === 0) {
		userList.innerHTML = "Nothing to see here...";
		return userList;
	}
	users.forEach(user => {
		userList.innerHTML += `
		<div class="card flex-row flex-wrap">
		<div class="card-header border-0">
			<div class="cropped-image">
				<img src="` + user["avatar"] + `" alt="` + user["username"] + `'s profile picture" />
			</div>
		</div>
		<div class="card-block px-2">
           <h4 class="card-title">`+ user["username"] +`</h4>
           <p class="card-text">`+ user['email'] +`</p>
            ` + friendButton(user["id"], friends) + `
		</div>
		<div class="w-100"></div>
		</div>
    `});

	return userList;
}

function friendButton(id, friends) {
	if (friends === "none") {
		return ;
	}
	for (let friend in friends) {
		if (friends[friend].id == id)
			return `<button type="button" class="btn btn-outline-primary" onclick="deleteFriend(`+ id +`, this)">Delete friend</button>`;
	}
	return `<button type="button" class="btn btn-primary" onclick="addFriend(`+ id +`, this)">Add Friend</button>`;
}
