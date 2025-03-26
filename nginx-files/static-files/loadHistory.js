import getHistoryTable from "./getHistoryTable.js";
import getUser from "./getUser.js";

export default function loadHistory() {
	const root = document.getElementById("root");
	const token = localStorage.getItem("token");
	if (!token) {
		window.location.hash = "";
		return ;
	}
	root.replaceChildren(mockUpHistory());

	getUser(token).then((user) => {
		getHistoryTable(user, token).then((table) => {
			// root.replaceChildren(table);
	})});

}

function mockUpHistory() {
	const form = document.createElement("form");
	form.innerHTML = `
  <div class="mb-3">
    <label for="winner" class="form-label">Winner id:</label>
    <input type="number" class="form-control" id="winner" name="winner_id">
  </div>
  <div class="mb-3">
    <label for="winner_goals" class="form-label">Winner goals:</label>
    <input type="number" class="form-control" id="winner_goals" name="winner_goals">
  </div>
 <div class="mb-3">
    <label for="loser" class="form-label">loser id:</label>
    <input type="number" class="form-control" id="loser" name="loser_id">
  </div>
  <div class="mb-3">
    <label for="loser_goals" class="form-label">loser goals:</label>
    <input type="number" class="form-control" id="loser_goals" name="loser_goals">
  </div>
 <div class="mb-3">
    <label for="duration" class="form-label">duration</label>
    <input type="text" class="form-control" id="duration" name="duration">
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>`

  form.addEventListener("submit", (event) => {
	event.preventDefault();
	sendMatch(form);
})

	return form;
}

function sendMatch(form) {
	const data = new FormData(form);
	fetch("https://" + window.location.hostname + ":7000/history/add/", {
		method: "POST",
		body: data,
	});
}
