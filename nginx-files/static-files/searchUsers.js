export default async function searchUsers(query, token) {
	const response = await fetch("https://" + window.location.hostname + ":" + window.location.port + "/profile/users?search=" + query, {
	  method: "GET",
	  headers: {
		  "AUTHORIZATION": "Bearer " + token,
	  }
  });
  const data = await response.json();
  return data;
}