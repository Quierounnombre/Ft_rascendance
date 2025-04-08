export default async function searchUsers(query, token) {
	const response = await fetch("https://" + window.location.hostname + ":7070/profile/users?search=" + query, {
	  method: "GET",
	  headers: {
		  "Authorization": "Token " + token,
	  }
  });
  const data = await response.json();
  return data;
}