export default function loadAnonHeader() {
	const footer = document.getElementById("footer");
    footer.setAttribute("class", "py-3 my-4 border-top");
	footer.innerHTML = `<div class="col-12 text-center">Rascendance is a project made by <a href="https://github.com/Quierounnombre">vicgarci</a>, <a href="https://github.com/pablo-is-a-goblin">psacrist</a>, <a href="https://github.com/witemirlo">jberdugo</a> & <a href="https://github.com/ferri666">ffons-ti</a></div><p class="col12 text-center"><i>In honor of </i><a href="https://github.com/hitchhikergalactic">osredond</a> &#10013</p>`;
}