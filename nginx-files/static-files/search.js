async function search() {
    const query = document.getElementById("search-box").value;
    const root = document.getElementById("root");
    const users = await searchUsers(query);
	const token = localStorage.getItem("token");
	var user;
	if (token) {
		user = await getUsers(token);
	}
    loadUsers(users, root, user);
}



async function searchUsers(query) {
    const response = await fetch("https://" + window.location.hostname + ":7000/profile/users?search=" + query, {
        method: "GET",
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    }
}

function loadUsers(users, root, myUser) {
    const page = document.createElement("div");
    page.setAttribute("class", "container");
    users.forEach(user => {
		if (myUser["id"] !== user["id"]) {
			page.innerHTML += `
		<div class="card flex-row flex-wrap">
		<div class="card-header border-0">
           <img style="max-width:100px" src="`+ user["avatar"] + `" alt="profile picture" />
		</div>
		<div class="card-block px-2">
           <h4 class="card-title">`+ user["username"] +`</h4>
           <p class="card-text">`+ user['email'] +`</p>
            ` + friendButton(user["id"], myUser["following"]) + `

		</div>
		<div class="w-100"></div>
		</div>
    `}});

    root.replaceChildren(page);
}

function friendButton(id, friends) {
	if (friends === "none") {
		return ;
	}
	if (friends.includes(id)) {
		return `<button type="button" class="btn btn-outline-primary" disabled>Already your friend</button>`;
	} else {
		return `<button type="button" class="btn btn-primary" onclick="addFriend(`+ id +`, this)">Add Friend</button>`;
	}
}

function addFriend(id, button) {
	const formData = new FormData();
	const token = localStorage.getItem("token");
	formData.append("friendID", id)

	fetch("https://" + window.location.hostname + ":7000/profile/friend/", {
        method: "PUT",
		body: formData,
		headers: {
			"Authorization": "Token " + token,
		},
	})

	button.setAttribute("class", "btn btn-outline-primary");
	button.setAttribute("disabled", "");
	button.innerHTML = "Already your friend";
	button.removeAttribute("onclick");

}