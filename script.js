const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

addTaskButton.addEventListener("click", function () {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const task = document.createElement("li");

    const taskTextElement = document.createElement("span");
    taskTextElement.textContent = taskText;

    taskTextElement.addEventListener("click", function () {
        task.classList.toggle("completed");
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
        task.remove();
    });

    task.appendChild(taskTextElement);
    task.appendChild(deleteButton);

    taskList.appendChild(task);

    taskInput.value = "";
});