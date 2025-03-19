export default function loadSocial() {
	const token = localStorage.getItem("token");
	const root = document.getElementById("root");
	const friends = getFriendList(token);
	if (friends === -1) {
		return ;
	}

	const searchBar	= document.createElement("div");
	searchBar.innerHTML = `
<div class="search-container input-group">
<input type="text" id="search-box" class="form-control search-input" placeholder="Search other users">
<button class="btn btn-outline-secondary"><i class="bi bi-search"></i></button>
</div>
`;
	searchBar.getElementsByTagName("button")[0].addEventListener("click", (event) => {
		search(this);
	});
	root.replaceChildren(searchBar);
	root.appendChild(friends);
}

function getFriendList(token) {
	const friends = getMyFriends(token);
	if (friends === -1) {
		localStorage.removeItem("token");
		window.location.hash = "#anon-menu";
		return -1;
	}
	const friendList = document.createElement("div");
	if (!friends) {
		friendList.innerHTML = "Seems like you don't have any friends...";
		return friendList;
	}
	friends.forEach(user => {
		var logged_span;
		if (user["is_logged"] === false)
			logged_span = `<span class="position-absolute translate-middle p-2 bg-danger border border-light rounded-circle">
  							<span class="visually-hidden">Not logged</span>
  							</span>`;
		else 
		logged_span = `<span class="position-absolute translate-middle p-2 bg-success border border-light rounded-circle">
						<span class="visually-hidden">Logged</span>
					</span>`;
		friendList.innerHTML += `
		<div class="card flex-row flex-wrap">
		<div class="card-header border-0">
			<div class="cropped-image">
				<img src="` + user["avatar"] + `" alt="` + user["username"] + `'s profile picture" />
				`+ logged_span +`
			</div>
		</div>
		<div class="card-block px-2">
           <h4 class="card-title">`+ user["username"] +`</h4>
           <p class="card-text">`+ user['email'] +`</p>
		</div>
		<div class="w-100"></div>
		</div>
    `});

	return friendList;
}

function getMyFriends(token) {
	try {
		fetch("https://" + window.location.hostname + ":7000/profile/friends/", {
			method: "GET",
			headers: {
				"Authorization": "Token " + token,
			}
		}).then((response) => {
		if (response.ok) {
			response.json().then((data) => {return data.following});
		} else {
			return -1;
		}
		})
	} catch (e) {
		console.error(e);
		return -1;
	}
}