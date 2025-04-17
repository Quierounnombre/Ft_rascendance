import getMyFriends from "./getMyFriends.js";
import translatePage from "./translate.js";
import {getCookie, deleteCookie} from "./cookiesManagement.js"
import { seeProfile, addFriend, deleteFriend } from "./friendMng.js";

export default async function loadSocial() {
	const token = getCookie("token");
	const root = document.getElementById("root");
	const friends = await getFriendList(token);
	if (friends === -1) {
		return ;
	}

	const searchBar	= document.createElement("div");
	searchBar.innerHTML = `
<div class="search-container input-group">
<input type="text" id="search-box" class="form-control search-input" data-i18n-key="search-bar" placeholder="Search other users">
<button class="btn btn-outline-secondary" id="search-button"><i class="bi bi-search"></i></button>
</div>
`;

searchBar.getElementsByTagName("input")[0].addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && window.location.hash=="#social")
    {
        localStorage.setItem("query", searchBar.getElementsByTagName("input")[0].value);
        window.location.hash = "#search";
    }
});

searchBar.getElementsByTagName("button")[0].addEventListener("click", (event) => {
		localStorage.setItem("query", searchBar.getElementsByTagName("input")[0].value);
		window.location.hash = "#search";
	});
	root.replaceChildren(searchBar);
	root.appendChild(friends);
    translatePage();
}

async function getFriendList(token) {
	const friends = await getMyFriends(token);
	if (friends === -1) {
		deleteCookie("token");
		window.location.hash = "#anon-menu";
		return -1;
	}
	const friendList = document.createElement("div");
	if (friends.length === 0) {
		friendList.innerHTML = "Seems like you don't have any friends...";
        friendList.setAttribute("data-i18n-key", "no-friends");
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
		<div class="card flex-row flex-wrap mb-2">
		<div class="card-header border-0">
			<div class="cropped-image">
				<img src="` + user["avatar"] + `" alt="` + user["username"] + `'s profile picture" />
				`+ logged_span +`
			</div>
		</div>
		<div class="card-block px-2">
           <h4 class="card-title">`+ user["username"] +`</h4>
           <p class="card-text">`+ user['email'] +`</p>
            ` + friendButton(user["id"], friends) + `
			<button type="button" class="btn btn-lg btn-warning" data-i18n-key="see-prof" userid="`+user["id"]+`">See Profile</button>
		</div>

		<div class="w-100"></div>
		</div>
    `});
	const buttons = friendList.getElementsByTagName("button");
	[...buttons].forEach(button => {
		if (button.getAttribute("data-i18n-key") === "see-prof") {
			button.addEventListener("click", () => {
				seeProfile(button.getAttribute("userid"));
			})
		} else if (button.getAttribute("data-i18n-key")==="del-friend") {
			button.addEventListener("click", () => {
				deleteFriend(button.getAttribute("userid"), button);
			})
		} else if (button.getAttribute("data-i18n-key")==="add-friend") {
			button.addEventListener("click", () => {
				addFriend(button.getAttribute("userid"), button);
			})
	}})
	translatePage();

	return friendList;
}

function friendButton(id, friends) {
	if (friends === "none") {
		return ;
	}
	for (let friend in friends) {
		if (friends[friend].id == id)
			return `<button type="button" data-i18n-key="del-friend" class="btn btn-lg btn-outline-primary" userid="`+ id +`">Delete friend</button>`;
	}
	return `<button type="button" data-i18n-key="add-friend" class="btn btn-lg me-2 btn-primary" userid="`+ id +`">Add Friend</button>`;
}

