"use strict";

const form = document.getElementById("my_form");
let token;
let users;

async function sendData() {
  const formData = new FormData(form);

  try {
    const response = await fetch("http://localhost:8080/api-token/", {
      method: "POST",
      body: formData,
    });
	const data = await response.json();
	token = data.token;
  } catch (e) {
    console.error(e);
  }
}

// Take over form submission
form.addEventListener("submit", (event) => {
	event.preventDefault();
	sendData();
});

function printToken() {
	const display = document.getElementById("my_token");
	if (!token)
		display.innerHTML = "You are not logged!";
	else
		display.innerHTML = displayUsers();
}

function displayUsers () {
  getUsers();
  return formatTable(users);
}

async function getUsers () {
  try {
    const response = await fetch("http://localhost:8080/users/", {
      method: "GET",
      headers: {
        "Authorization" : "Token " + token,
      }
    });
	const data = await response.json();
	users = data;
  } catch (e) {
    console.error(e);
  }
}

function formatTable(jsonData){

  var table = "<table class=\"table\">\
  <thead>\
    <tr>\
      <th scope=\"col\">Num</th>\
      <th scope=\"col\">Email</th>\
      <th scope=\"col\">Username</th>\
      <th scope=\"col\">Language</th>\
    </tr>\
  </thead>\
  <tbody>";

  for (let i in jsonData) {
    console.log("User " + i);
    table = table + "<tr>\n" +
    "<th scope=\"row\">" + (i + 1) + "</th>\n" +
    "<td>"+ jsonData[i].email + "</td>\n" + 
    "<td>"+ jsonData[i].username + "</td>\n" +
    "<td>"+ jsonData[i].language + "</td>\n" +
    "</tr>";
    console.log(table);
  }
  table + "</tbody></table>";
  return table;
}