export default function loadSearch() {
	const bar =  document.createElement("div");
	bar.innerHTML = `
<div class="search-container input-group">
<input type="text" id="search-box" class="form-control search-input" placeholder="Search other users">
<button class="btn btn-outline-secondary" onclick="search()"><i class="bi bi-search"></i></button>
</div>
`
    const root = document.getElementById("root");
	root.replaceChildren(bar);
}