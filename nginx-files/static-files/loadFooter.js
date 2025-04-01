export default function loadAnonHeader() {
	const footer = document.getElementById("footer");
    footer.setAttribute("class", "py-3 my-4 border-top");
	footer.innerHTML = `<div class="col-12 text-center" data-i18n-key="footer-1">Rascendance is a project made by</div> <p class="text-center"><a href="https://github.com/Quierounnombre">vicgarci</a>, <a href="https://github.com/pablo-is-a-goblin">psacrist</a>, <a href="https://github.com/witemirlo">jberdugo</a> & <a href="https://github.com/ferri666">ffons-ti</a></div><p class="col12 text-center" ><i data-i18n-key="footer-2">In honor of </i><a href="https://github.com/hitchhikergalactic">osredond</a> &#10013</p> <select id="lang-switcher" data-i18n-switcher class="locale-switcher">
            <option value="ENG">English</option>
            <option value="ESP">Español</option>
            <option value="CAT">Català</option>
          </select>`;
}