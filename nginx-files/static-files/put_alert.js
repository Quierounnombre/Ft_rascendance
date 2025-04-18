import translatePage from "./translate.js";

export default function put_alert(id, msg) {
	const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
	const wrapper = document.createElement('div')

	wrapper.innerHTML = `
		<div class="alert alert-danger alert-dismissible" role="alert">
			<div data-i18n-key="${id}">${msg}</div>
			<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		</div>
	`;

	alertPlaceholder.append(wrapper);
	translatePage();
}