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

    task.textContent = taskText;
    
    task.addEventListener("click", function () {
    task.classList.toggle("completed");
});

    taskList.appendChild(task);

    taskInput.value = "";
});