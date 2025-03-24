function addFriend(id, button) {
	const formData = new FormData();
	const token = localStorage.getItem("token");
	formData.append("friendID", id)

	fetch("https://" + window.location.hostname + ":7000/profile/friends/", {
        method: "PUT",
		body: formData,
		headers: {
			"Authorization": "Token " + token,
		},
	})

	button.setAttribute("class", "btn btn-outline-primary");
	button.innerHTML = "Delete friend";
	button.setAttribute("onclick", "deleteFriend("+ id +", this)");
}

function deleteFriend(id, button) {
	const formData = new FormData();
	const token = localStorage.getItem("token");
	formData.append("friendID", id);

	fetch("https://" + window.location.hostname + ":7000/profile/friends/", {
        method: "DELETE",
		body: formData,
		headers: {
			"Authorization": "Token " + token,
		},
	})

	button.setAttribute("class", "btn btn-primary");
	button.innerHTML = "Add Friend";
	button.setAttribute("onclick", "addFriend("+ id +", this)");
}

function seeProfile(id) {
	localStorage.setItem("user_id", id);
	window.location.hash = "#user"
}