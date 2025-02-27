import pong from "./pong.js"

const submit = document.getElementById("submit", convertToJSON, false);
submit.addEventListener("click", convertToJSON, false);

export default function convertToJSON() {
	const form = document.getElementById("dataForm");
	let formData = {};
	let tmp = [
		{
			"id": "player1",
			"type": "player",
	
			"x": 10,
			"y": 200,
		
			"width": 20,
			"height": 100,
	
			"speed": 2,
	
			"move_up": "w",
			"move_down": "s"
		},
		{
			"id": "player2",
			"type": "player",
	
			"x": 790,
			"y": 200,
		
			"width": 20,
			"height": 100,
	
			"speed": 2,
	
			"move_up": "ArrowUp",
			"move_down": "ArrowDown"
		},
		{
			"id": "ball",
			"type": "ball",
	
			"x": 400,
			"y": 200,
			"dirX": 1,
			"dirY": 1,
		
			"radius": 10
		},
		{
			"id": "counter",
			"type": "counter",
			"x": 400,
			"y": 10,
			"font": "42px Arial"
		}
	]
	for (let i = 0; i < form.elements.length; i++) {
		let element = form.elements[i];
		if (element.type !== "submit") {
		formData[element.name] = element.value;
		}
	}
	formData.type = "config";
	tmp.push(formData)
	let jsonData = JSON.stringify(tmp);
	let jsonOutput = document.getElementById("jsonOutput");
	jsonOutput.innerHTML = `<canvas id="pong" width="800" height="400"></canvas>`;
	pong(jsonData);
}
