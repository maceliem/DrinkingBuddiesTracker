function addPlayer(){
	playerName = document.getElementById("addPlayer").value
	document.getElementById("addPlayer").value = ""
	if (playerName == "") return console.log("Name too short")
	li = document.createElement("li")
	li.draggable = "true"
	li.innerHTML = playerName
	li.onclick = function() {
		removePlayer(this);
	}
	document.getElementById("sortable").appendChild(li)
	
	div = document.createElement("div")
	div.classList.add("nameCard")
	div.innerHTML = playerName
	document.getElementById("nameBox").appendChild(div)
	updateCards()
}

function removePlayer(elm){
	if (confirm(`Want to remove ${elm.innerHTML}?`)){
		const nameCards = document.getElementsByClassName("nameCard")
		const nameCard = Array.from(nameCards).find(element => element.innerHTML == elm.innerHTML);
		document.getElementById("sortable").removeChild(elm)
		document.getElementById("nameBox").removeChild(nameCard)
		updateCards()
	}
}

function updateCards(){
	const ngonElements = document.querySelectorAll('.nameCard');
	const n = ngonElements.length;
	const nameBox = document.getElementById('nameBox');
	const radius = nameBox.offsetWidth / 3; // Adjust the radius as needed

	const centerX = nameBox.offsetWidth / 2;
	const centerY = nameBox.offsetHeight / 2;

	ngonElements.forEach((element, index) => {
		let angle = (2 * Math.PI / n) * index;
		if (n%2 == 1) angle -= Math.PI/2
		const x = centerX + radius * Math.cos(angle) - element.offsetWidth / 2;
		const y = centerY + radius * Math.sin(angle) - element.offsetHeight / 2;
		element.style.left = `${x}px`;
		element.style.top = `${y}px`;
	});
}

updateCards()