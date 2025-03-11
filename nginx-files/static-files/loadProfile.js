const profile = document.createElement("div");

const login_page = document.createElement("div");
login_page.innerHTML = `
<h1>Log in to see your profile</h1>
<div id="buttons">
<button class="btn btn-secondary" type="button" id="log_button" onclick="toggleForm('login')">Log in</button>
<button class="btn btn-primary" type="button" id="singup_button" onclick="toggleForm('signup')">Don't have an account? Sign Up!</button>
</div>
<div id="form_div"></div>
`

export default async function loadProfile() {
	const token = localStorage.getItem("token");
	const root = document.getElementById("root");
	if (token) {
		const profileHTML = await displayProfile(token);
		if (!profileHTML) {
			root.replaceChildren(login_page);
		} else {
			profile.innerHTML = profileHTML + `
			<button class="btn btn-primary" type="button" id="backhome_button" onclick=\"window.location.hash=\'\#home\'\">Back to home</button>
			<button class="btn btn-danger" type="button" id="logout_button" onclick="logOut()">Log out</button>
			<button class="btn btn-secondary" type="button" id="edit_button" onclick="editProfile()">Edit Profile</button>
			`;
			root.replaceChildren(profile);
		}
	} else {
		root.replaceChildren(login_page);
	}
}