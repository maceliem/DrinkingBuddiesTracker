let rules = [
]
let recursive = 0

playerNameInput = document.getElementById("addPlayer")
playerNameInput.addEventListener('keydown', function(event) {
	if (event.key === 'Enter') {
		event.preventDefault();  // Prevent form submission or other default behavior
		addPlayer()
	}
})
function addPlayer(){
	playerName = playerNameInput.value
	playerNameInput.value = ""
	if (playerName == "") return console.log("Name too short")
	li = document.createElement("li")
	li.draggable = "true"
	li.innerHTML = playerName
	li.onclick = function() {
		removePlayer(this);
	}
	document.getElementById("sortable").appendChild(li)
	
	addNameCard(playerName)
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
function addNameCard(name){
	div = document.createElement("div")
	div.classList.add("nameCard")
	div.innerHTML = name
	div.addEventListener("mouseover", function() {
		targetOn(this)
	})
	div.addEventListener("touchstart", function(){
		targetOn(this)
	})
	div.addEventListener("mouseout", function() {
		targetOff()
	})
	div.addEventListener("touchend", function() {
		targetOff()
	})
	document.getElementById("nameBox").appendChild(div)
}

function targetOn(card, n = recursive + 1) {
	card.style.backgroundColor = "Red"
	if (n == 0) return
	for (const rule of rules){
		if (rule.type == "turn"){
			const cards = document.getElementsByClassName("nameCard")
			for (let i in cards){
				i = parseInt(i)
				if (cards[i] == card){
					targetOn(cards[(cards.length + i + rule.val) % cards.length], n-1)
				}
			}
		}
	}
}

function targetOff() {
	for (const card of document.getElementsByClassName("nameCard")) {
		card.style.backgroundColor = "rgb(244, 243, 230)"
	}
}

const recursiveBox = document.getElementById("recursive")

recursiveBox.addEventListener("input", function(e){
	recursive = parseInt(e.target.value)
})

function addNewRule(){
	type = document.getElementById("ruleType").value
	val = document.getElementById("ruleVal").value
	const li = document.createElement("li")
	li.innerHTML = type + " - " + val
	li.addEventListener("click", removeRule)
	document.getElementById("rule-list").appendChild(li)
	if (type == "Left") {
		type = "turn"
		val = parseInt(val)
	}else if (type == "Right"){
		type = "turn"
		val *= -1
	}
	rules.push({
		"type": type,
		"val": val,
	})

	document.getElementById("ruleType").value = ""
	document.getElementById("ruleVal").value = 1
}

function removeRule(e){
	if (confirm("Wanna remove the rule?")){
		const li = e.target
		const str = li.innerHTML.split(" - ")
		let type = str[0]
		let val = str[1]
		if (type == "Left"){
			type = "turn"
		}else if (type == "Right"){
			type = "turn"
			val *= -1
		}
		const rule = rules.find(item => item.type == type && item.val == val)
		rules = rules.filter(item => item != rule)
		document.getElementById("rule-list").removeChild(li)
	}
}