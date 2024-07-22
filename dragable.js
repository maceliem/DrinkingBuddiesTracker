// Script.js
const sortableList = document.getElementById("sortable");
let draggedItem = null;
let isDragging = false;
let longPressTimeout = null;

// Function to start a long press detection
function startLongPress(e) {
	longPressTimeout = setTimeout(() => {
		if (!isDragging) {
			removePlayer(e.target)
		}
	}, 1000);
}

// Function to cancel the long press detection
function cancelLongPress() {
	if (longPressTimeout) {
		clearTimeout(longPressTimeout);
		longPressTimeout = null;
	}
}

function handleDragStart(e) {
	isDragging = true;
	draggedItem = e.target;
	e.target.classList.add('dragging');
	cancelLongPress(); // Cancel long press detection if dragging starts
}

function handleDragEnd(e) {
	isDragging = false;
	setTimeout(() => {
		draggedItem.classList.remove('dragging');
		draggedItem = null;
		const playerlist = document.getElementById("sortable").getElementsByTagName("li");
		const nameBox = document.getElementById("nameBox");
		nameBox.innerHTML = "";
		for (let player of playerlist) {
			let div = document.createElement("div");
			div.classList.add("nameCard");
			div.innerHTML = player.innerHTML;
			nameBox.appendChild(div);
		}
		updateCards();
	}, 0);
}

function handleDragOver(e) {
	if (isDragging) {
		e.preventDefault();
		const afterElement = getDragAfterElement(sortableList, e.clientY);
		if (afterElement == null) {
			sortableList.appendChild(draggedItem);
		} else {
			sortableList.insertBefore(draggedItem, afterElement);
		}
	}
}

function handleTouchStart(e) {
	e.preventDefault();
	const touch = e.touches[0];
	draggedItem = touch.target;
	draggedItem.classList.add('dragging');
	startLongPress(e); // Start long press detection
}

function handleTouchMove(e) {
	e.preventDefault();
	const touch = e.touches[0];
	if (draggedItem) {
		const afterElement = getDragAfterElement(sortableList, touch.clientY);
		if (afterElement == null) {
			sortableList.appendChild(draggedItem);
		} else {
			sortableList.insertBefore(draggedItem, afterElement);
		}
	}
	cancelLongPress(); // Cancel long press detection if dragging starts
}

function handleTouchEnd(e) {
	e.preventDefault();
	cancelLongPress(); // Cancel long press detection
	setTimeout(() => {
		if (draggedItem) {
			draggedItem.classList.remove('dragging');
			draggedItem = null;
			const playerlist = document.getElementById("sortable").getElementsByTagName("li");
			const nameBox = document.getElementById("nameBox");
			nameBox.innerHTML = "";
			for (let player of playerlist) {
				let div = document.createElement("div");
				div.classList.add("nameCard");
				div.innerHTML = player.innerHTML;
				nameBox.appendChild(div);
			}
			updateCards();
		}
	}, 0);
}

sortableList.addEventListener("dragstart", handleDragStart);
sortableList.addEventListener("dragend", handleDragEnd);
sortableList.addEventListener("dragover", handleDragOver);

// Add touch event listeners
sortableList.addEventListener("touchstart", handleTouchStart);
sortableList.addEventListener("touchmove", handleTouchMove);
sortableList.addEventListener("touchend", handleTouchEnd);

const getDragAfterElement = (container, y) => {
	const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];

	return draggableElements.reduce((closest, child) => {
		const box = child.getBoundingClientRect();
		const offset = y - box.top - box.height / 2;
		if (offset < 0 && offset > closest.offset) {
			return { offset: offset, element: child };
		} else {
			return closest;
		}
	}, { offset: Number.NEGATIVE_INFINITY }).element;
};
