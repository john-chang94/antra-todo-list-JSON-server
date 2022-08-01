// CONSTS
const BASE_URL = "http://localhost:3000";
const TODOS_PATH = "todos";

// API
const getTodos = () => {
  const todosUrl = [BASE_URL, TODOS_PATH].join("/");
  return fetch(todosUrl).then((res) => res.json());
};

const getTodo = (id) => {
  const todosUrl = [BASE_URL, TODOS_PATH, id].join("/");
  return fetch(todosUrl).then((res) => res.json());
};

const addTodo = (todo) => {
  const todosUrl = [BASE_URL, TODOS_PATH].join("/");
  const data = { title: todo, completed: false };

  return fetch(todosUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

const updateTodo = (todo, id) => {
  const todosUrl = [BASE_URL, TODOS_PATH, id].join("/");
  const data = { title: todo, completed: false };

  return fetch(todosUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

const patchTodo = (completed, id) => {
  const todosUrl = [BASE_URL, TODOS_PATH, id].join("/");
  const data = { completed };

  return fetch(todosUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

const deleteTodo = (id) => {
  const todosUrl = [BASE_URL, TODOS_PATH, id].join("/");
  return fetch(todosUrl, { method: "DELETE" }).then((res) => res.json());
};

// VIEWS
const renderContainer = () => `
    <div class="container">
        <div class="input__wrapper flex flex-center">
            <input type="text" id="todo-input" />
            <button class="button__submit" onclick="handleSubmit()">submit</submit>
        </div>
        <section class="todos"></section>
    </div>
`;

const renderTodo = (todo) => `
    <p id="todo-text-${todo.id}" class="todo__paragraph ${todo.completed && "todo__completed"}">
        ${todo.title}
    </p>
    <div>
        <button class="button blue" id="btn-edit-${todo.id}">
            <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small">
                <path
                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z">
                </path>
            </svg>
        </button>
        <button class="button red" id="btn-delete-${todo.id}">
            <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
            </svg>
        </button>
    </div>
`;

// EVENTS
const handleSubmit = () => {
  let todoInput = document.getElementById("todo-input");
  addTodo(todoInput.value).then((data) => {
    fetchData();
    // todoInput.innerHTML = "";
  });
};
// const addSubmitHandler = (id) => {
//     const todoInput = document.getElementById("todo-input").value;

//     const btn = document.querySelector(".button__submit");
//     btn.addEventListener("click", (e) => {
//         console.log(e.target)
//     })
// }

const addEditHandler = (id) => {
  const todo = document.getElementById(`todo-${id}`);
  const btn = document.getElementById(`btn-edit-${id}`);

  btn.addEventListener("click", (e) => {
    // run if todo is displayed
    if (todo.children[0].nodeName === "P") {
      // ref todo p tag
      const todoText = document.getElementById(`todo-text-${id}`);

      // create text input with required values
      const editInput = document.createElement("INPUT");
      editInput.id = "edit-input";
      editInput.value = todoText.innerHTML;

      // replace p tag with temp text input
      todoText.replaceWith(editInput);
    } else {
      // ref text input with updated todo
      const editInput = document.getElementById("edit-input");

      // create p tag with updated todo
      const todoText = document.createElement("P");
      todoText.id = `todo-text-${todo.id}`;
      todoText.className = `todo__paragraph ${
        todo.completed && "todo__completed"
      }`;
      const newValue = editInput.value;
      todoText.innerHTML = newValue;

      // replace text input with updated p tag
      editInput.replaceWith(todoText);

      // update todo in db
      updateTodo(newValue, id).then((data) => fetchData());
    }
  });
};

const addPatchHandler = (id) => {
  getTodo(id).then((data) => {
    const todo = document.getElementById(`todo-text-${id}`);
    todo.addEventListener("click", (e) => {
      patchTodo(!data.completed, id).then((data) => fetchData());
    });
  });
};

const addDeleteHandler = (id) => {
  const btn = document.getElementById(`btn-delete-${id}`);
  btn.addEventListener("click", (e) => {
    deleteTodo(id).then(() => fetchData());
  });
};

// RUN
const fetchData = () => {
  const todosContainer = document.querySelector(".todos");
  todosContainer.innerHTML = "";

  getTodos().then((data) => {
    data.map((todo) => {
      const todoNode = document.createElement("article");
      todoNode.id = `todo-${todo.id}`;
      todoNode.className = "flex space-between align-center";

      const todoCard = renderTodo(todo);
      todoNode.innerHTML = todoCard;

      //   const todosContainer = document.querySelector(".todos");
      todosContainer.appendChild(todoNode);

      addEditHandler(todo.id);
      addPatchHandler(todo.id);
      addDeleteHandler(todo.id);
    });
  });
};

const container = renderContainer();
const root = document.querySelector("#root");
root.innerHTML = container;

// addSubmitHandler();

fetchData();
