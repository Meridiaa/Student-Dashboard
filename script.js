const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

const totalTasksElement = document.getElementById("totalTasks");
const completedTasksElement = document.getElementById("completedTasks");
const progressPercentageElement = document.getElementById("progressPercentage");


// ====================
// TASK STATISTICS
// ====================

function updateStatistics() {

    const tasks = taskList.querySelectorAll("li");

    const totalTasks = tasks.length;

    let completedTasks = 0;

    tasks.forEach(function (task) {

        if (task.classList.contains("completed")) {
            completedTasks++;
        }

    });

    let progress = 0;

    if (totalTasks > 0) {
        progress = Math.round((completedTasks / totalTasks) * 100);
    }

    totalTasksElement.textContent = totalTasks;
    completedTasksElement.textContent = completedTasks;
    progressPercentageElement.textContent = progress + "%";
}


// ====================
// ADD TASK
// ====================

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

        updateStatistics();

    });


    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {

        task.remove();

        updateStatistics();

    });


    task.appendChild(taskTextElement);
    task.appendChild(deleteButton);

    taskList.appendChild(task);

    updateStatistics();

    taskInput.value = "";

});


// ====================
// POMODORO TIMER
// ====================

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

let timeLeft = WORK_TIME;
let timerInterval = null;
let isWorkSession = true;

const timerDisplay = document.getElementById("timer");
const timerMode = document.getElementById("timerMode");

const startTimerButton = document.getElementById("startTimer");
const pauseTimerButton = document.getElementById("pauseTimer");
const resetTimerButton = document.getElementById("resetTimer");


function updateTimerDisplay() {

    const minutes = Math.floor(timeLeft / 60);

    const seconds = timeLeft % 60;

    const formattedSeconds = seconds < 10
        ? "0" + seconds
        : seconds;

    timerDisplay.textContent =
        minutes + ":" + formattedSeconds;

}


function updateTimerMode() {

    if (isWorkSession) {

        timerMode.textContent = "Work Session";

    } else {

        timerMode.textContent = "Break Time";

    }

}


function switchSession() {

    clearInterval(timerInterval);

    timerInterval = null;

    isWorkSession = !isWorkSession;

    if (isWorkSession) {

        timeLeft = WORK_TIME;

        alert("Break is over! Time to study. 📚");

    } else {

        timeLeft = BREAK_TIME;

        alert("Work session complete! Take a break. ☕");

    }

    updateTimerMode();

    updateTimerDisplay();

}


startTimerButton.addEventListener("click", function () {

    if (timerInterval !== null) {
        return;
    }

    timerInterval = setInterval(function () {

        if (timeLeft > 0) {

            timeLeft--;

            updateTimerDisplay();

        } else {

            switchSession();

        }

    }, 1000);

});


pauseTimerButton.addEventListener("click", function () {

    clearInterval(timerInterval);

    timerInterval = null;

});


resetTimerButton.addEventListener("click", function () {

    clearInterval(timerInterval);

    timerInterval = null;

    isWorkSession = true;

    timeLeft = WORK_TIME;

    updateTimerMode();

    updateTimerDisplay();

});


// ====================
// NOTES + LOCAL STORAGE
// ====================

const notesElement = document.getElementById("notes");

const savedNotes = localStorage.getItem("studentNotes");

if (savedNotes !== null) {

    notesElement.value = savedNotes;

}


notesElement.addEventListener("input", function () {

    localStorage.setItem(
        "studentNotes",
        notesElement.value
    );

});


// ====================
// INITIAL DISPLAY
// ====================

updateTimerMode();

updateTimerDisplay();

updateStatistics();