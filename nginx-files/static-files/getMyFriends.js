export default async function getMyFriends(token) {
	try {
		const response = await fetch("https://" + window.location.hostname + ":7070/profile/friends/", {
			method: "GET",
			headers: {
				"Authorization": "Token " + token,
			}
		});
		if (response.ok) {
			const data = await response.json();
			return data.following;
		} else {
			return -1;
		}
	} catch (e) {
		console.error(e);
		return -1;
	}
}