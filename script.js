//selector
const form = document.querySelector("#formTask");
const input = document.querySelector("#inputForm");
const wrapperTask = document.querySelector(".wrapper-task");
const removeAllBtn = document.querySelector(".remove-all");
const inputSearch = document.querySelector("#inputSearch");

// set Event
window.addEventListener("DOMContentLoaded", showTasks);
form.addEventListener("submit", addTaskHandler);
form.addEventListener("reset", () => alert("form reset!"));
removeAllBtn.addEventListener("click", () => (wrapperTask.innerHTML = ""));
inputSearch.addEventListener("input", searchTaskHandler);

// functions
function showTasks() {
  const tasks = getLocalData();
  tasks.forEach((item) => {
    const newTask = document.createElement("div");
    newTask.className = `p-3 task-item bg-secondary d-flex justify-content-between m-3 rounded text-white align-items-center task-item ${
      item.isDone ? "done-task" : ""
    }`;
    newTask.innerHTML = `
    <span>${item.title}</span>
    <div>
      <button class="btn btn-danger m-1 remove-item"> Remove </button>
      <button class="btn btn-success m-1 done-item"> Done </button> 
    </div>`;

    const doneBtn = newTask.querySelector(".done-item");
    const removeBtn = newTask.querySelector(".remove-item");

    doneBtn.addEventListener("click", (e) => doneTaskHandler(e, item.id));
    removeBtn.addEventListener("click", (e) => removeTaskHandler(e, item.id));

    wrapperTask.appendChild(newTask);
  });
}

function addTaskHandler(event) {
  event.preventDefault();
  const newTask = document.createElement("div");
  newTask.className =
    "p-3 task-item bg-secondary d-flex justify-content-between m-3 rounded text-white align-items-center task-item";
  newTask.innerHTML = `
    <span>${input.value}</span>
    <div>
      <button class="btn btn-danger m-1 remove-item"> Remove </button>
      <button class="btn btn-success m-1 done-item"> Done </button> 
    </div>`;

  const doneBtn = newTask.querySelector(".done-item");
  const removeBtn = newTask.querySelector(".remove-item");
  const id = Date.now();

  doneBtn.addEventListener("click", (e) => doneTaskHandler(e, id));
  removeBtn.addEventListener("click", (e) => removeTaskHandler(e, id));

  wrapperTask.appendChild(newTask);
  saveToLocal(id, input.value, false);
  input.value = "";
}
function doneTaskHandler(event, id) {
  const parentTask = event.target.parentElement.parentElement;
  parentTask.classList.toggle("done-task");

  // upgrade localStorage
  const tasks = getLocalData();
  const currentTaskIndex = tasks.findIndex((item) => item.id === id);
  tasks[currentTaskIndex].isDone = !tasks[currentTaskIndex].isDone;
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function removeTaskHandler(event, id) {
  const parentTask = event.target.parentElement.parentElement;
  parentTask.remove();

  // upgrade localStorage
  const tasks = getLocalData();
  const newTasks = tasks.filter((item) => item.id !== id);
  localStorage.setItem("tasks", JSON.stringify(newTasks));
}
function searchTaskHandler(event) {
  console.log(this);
  console.log(event.target);
  const tasks = document.querySelectorAll(".task-item");
  tasks.forEach((item) => {
    const taskTitle = item.querySelector("span");
    item.classList.remove("hide"); // reset task
    if (!taskTitle.innerText.startsWith(this.value)) item.classList.add("hide");
  });
}

// localstorage functions
function saveToLocal(id, title, isDone) {
  const taskData = { id, title, isDone };
  const prevTask = getLocalData();
  const tasks = [...prevTask, taskData];
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function statusTask() {}
function getLocalData() {
  const tasks = localStorage.getItem("tasks") || "[]";
  const toJson = JSON.parse(tasks);
  return toJson;
}
