async function loadSearch() {
    const query = document.getElementById("search-box").value;
    const root = document.getElementById("root");
    const users = await searchUsers(query);
    loadUsers(users, root);
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

function loadUsers(users, root) {
    const page = document.createElement("div");
    page.setAttribute("class", "container");
    users.forEach(user => {
        page.innerHTML += `
           <div class="card flex-row flex-wrap">
        <div class="card-header border-0">
            <img style="max-width:100px" src="`+ user["avatar"] + `" alt="profile picture" />
        </div>
        <div class="card-block px-2">
            <h4 class="card-title">`+ user["username"] +`</h4>
            <p class="card-text">`+ user['email'] +`</p>
        </div>
        <div class="w-100"></div>
        </div>
    `});

    root.replaceChildren(page);
}