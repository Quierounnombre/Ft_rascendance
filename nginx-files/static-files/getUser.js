export default async function getUser(token) {
	try {
		const response = await fetch("https://" + window.location.hostname + ":" + window.location.port + "/profile/me/", {
			method: "GET",
			headers: {
				"AUTHORIZATION": "Bearer " + token,
			}
		});
		if (response.ok) {
			const data = await response.json();
			return data;
		} else {
			return -1;
		}
	} catch (e) {
		console.error(e);
		return -1;
	}
}