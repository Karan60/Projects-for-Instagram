const colorInput = document.getElementById("colorpicker");

colorInput.addEventListener("input", (e) => {
	document.body.style.setProperty("--button-color", e.target.value);
});

document
	.querySelector(".inbox-calendar")
	.addEventListener("click", function () {
		document
			.querySelector(".calendar-container")
			.classList.toggle("calendar-show");
		document.querySelector(".task-container").classList.toggle("hide");
		document.querySelector(".schedule-bar").classList.toggle("hide");
	});

// UI constants
const form = document.querySelector("#todo-form");
const list = document.querySelector("#todo-list");
const buttonAddTodo = document.querySelector("#button-add-todo");
const toggles = document.querySelectorAll(".todo-type-toggles > button");

// Enums
const states = {
	ACTIVE: "Active",
	COMPLETED: "Completed"
};

// Get Data on page load
let TODOs = [];
if (localStorage["data"] !== null && localStorage["data"] !== undefined) {
	TODOs = JSON.parse(localStorage["data"]);
}
// console.log({ TODOs });

function buildUI(state) {
	let HTML = ``;
	let viewTODOs = [];

	if (state === states.COMPLETED) {
		viewTODOs = TODOs.filter((todo) => todo.complete);
	} else {
		viewTODOs = TODOs.filter((todo) => !todo.complete);
	}

	if (viewTODOs.length === 0) {
		HTML = `<li class="empty">Nothing to do!</li>`;
	}

	viewTODOs.forEach((todo) => {
		if (todo !== null) {
			HTML += `<li id="${todo.id}" style="view-transition-name: list-item-${todo.id};" data-complete="${todo.complete}">
      <span class="text">${todo.title}</span>
      <button aria-label="Complete" class="button-complete">
        <svg width="20" height="20" viewBox="0 0 241.44 259.83" class="svg-check">
          <polyline points="16.17 148.63 72.17 225.63 225.17 11.63" pathLength="1" />
        </svg>
      </button>
    </li>`;
		}
	});

	list.innerHTML = HTML;
}

form.addEventListener("submit", (event) => {
	event.preventDefault();
	// Don't allow empty todo
	if (!form[0].value) {
		buttonAddTodo.classList.add("shake");
		return;
	}
	addTodo(event);
	form.reset();
});

function addTodo() {
	// TODO (lol): Sanitize user input.
	TODOs.push({
		title: form[0].value,
		complete: false,
		id: self.crypto.randomUUID()
	});
	localStorage["data"] = JSON.stringify(TODOs);
	buttonAddTodo.classList.add("added");
	buildUI();
}

document.documentElement.addEventListener("click", (event) => {
	if (event.target.classList.contains("button-complete")) {
		toggleTodo(event);
	}
});

list.addEventListener("dblclick", (event) => {
	const listItem = event.target.closest("li");

	// If already editing, let it be.
	if (listItem.classList.contains("editing")) return;

	listItem.classList.add("editing");
	const textItem = listItem.querySelector(".text");
	listItem.insertAdjacentHTML(
		"beforeend",
		`<form onsubmit="updateTodo(event);" class="form-edit"><input onblur="updateTodo(event);" type="text" class="input-edit" value="${textItem.textContent}"></form>`
	);

	const input = listItem.querySelector(".input-edit");
	input.focus();

	// put cursor at end of input
	input.setSelectionRange(input.value.length, input.value.length);
});

function updateTodo(event) {
	event.preventDefault();
	const listItem = event.target.closest("li");
	const textItem = listItem.querySelector(".text");
	const inputItem = listItem.querySelector(".input-edit");
	const form = listItem.querySelector(".form-edit");
	textItem.textContent = inputItem.value;
	listItem.classList.remove("editing");
	form.remove();
	TODOs = TODOs.map((todo) => {
		if (todo.id === listItem.id) {
			todo.title = inputItem.value;
		}
		return todo;
	});
	localStorage["data"] = JSON.stringify(TODOs);
}

function toggleTodo(event) {
	const listItem = event.target.parentElement;
	// Trigger complete animation
	listItem.classList.toggle("complete");
	setTimeout(() => {
		if (listItem.dataset.complete === "true") {
			TODOs = TODOs.filter((todo) => !todo.complete);
			if (!document.startViewTransition) {
				buildUI(states.COMPLETED);
			} else {
				document.startViewTransition(() => {
					buildUI();
				});
			}
		} else {
			TODOs.forEach((todo) => {
				if (todo.id === listItem.id) {
					todo.complete = !todo.complete;
				}
			});
			if (!document.startViewTransition) {
				buildUI(states.ACTIVE);
			} else {
				document.startViewTransition(() => {
					buildUI();
				});
			}
		}

		localStorage["data"] = JSON.stringify(TODOs);
	}, 1000);
}

toggles.forEach((toggle) => {
	toggle.addEventListener("click", (event) => {
		toggles.forEach((toggle) => {
			toggle.setAttribute("aria-pressed", false);
		});
		toggle.setAttribute("aria-pressed", true);

		if (toggle.textContent === states.ACTIVE) {
			buildUI(states.ACTIVE);
		} else {
			buildUI(states.COMPLETED);
		}
	});
});

buildUI();
