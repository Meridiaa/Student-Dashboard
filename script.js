const taskInput = document.getElementById("taskInput");
const taskDueDate = document.getElementById("taskDueDate");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

const totalTasksElement =
    document.getElementById("totalTasks");

const completedTasksElement =
    document.getElementById("completedTasks");

const progressPercentageElement =
    document.getElementById("progressPercentage");


// ====================
// TASK DATA
// ====================

let tasks =
    JSON.parse(
        localStorage.getItem("studentTasks")
    ) || [];

let currentFilter = "all";


// ====================
// SAVE TASKS
// ====================

function saveTasks() {

    localStorage.setItem(
        "studentTasks",
        JSON.stringify(tasks)
    );

}


// ====================
// DISPLAY TASKS
// ====================

function displayTasks() {

    taskList.innerHTML = "";


    tasks.forEach(function (taskData, index) {

        if (
            currentFilter === "active" &&
            taskData.completed
        ) {
            return;
        }


        if (
            currentFilter === "completed" &&
            !taskData.completed
        ) {
            return;
        }


        const task =
            document.createElement("li");


        if (taskData.completed) {

            task.classList.add("completed");

        }


        const taskContent =
            document.createElement("div");

        taskContent.classList.add(
            "task-content"
        );


        const taskTextElement =
            document.createElement("span");

        taskTextElement.textContent =
            taskData.text;


        taskTextElement.addEventListener(
            "click",
            function () {

                taskData.completed =
                    !taskData.completed;

                saveTasks();

                displayTasks();

            }
        );


        taskContent.appendChild(
            taskTextElement
        );


        if (taskData.dueDate) {

            const dueDateElement =
                document.createElement("small");

            dueDateElement.textContent =
                "📅 " + taskData.dueDate;

            dueDateElement.classList.add(
                "task-date"
            );

            taskContent.appendChild(
                dueDateElement
            );

        }


        const deleteButton =
            document.createElement("button");

        deleteButton.textContent =
            "Delete";


        deleteButton.addEventListener(
            "click",
            function () {

                tasks.splice(index, 1);

                saveTasks();

                displayTasks();

            }
        );


        task.appendChild(taskContent);

        task.appendChild(deleteButton);

        taskList.appendChild(task);

    });


    updateStatistics();

}


// ====================
// TASK STATISTICS
// ====================

function updateStatistics() {

    const totalTasks =
        tasks.length;

    let completedTasks = 0;


    tasks.forEach(function (task) {

        if (task.completed) {

            completedTasks++;

        }

    });


    let progress = 0;


    if (totalTasks > 0) {

        progress =
            Math.round(
                (completedTasks / totalTasks) * 100
            );

    }


    totalTasksElement.textContent =
        totalTasks;

    completedTasksElement.textContent =
        completedTasks;

    progressPercentageElement.textContent =
        progress + "%";

}


// ====================
// ADD TASK
// ====================

addTaskButton.addEventListener(
    "click",
    function () {

        const taskText =
            taskInput.value.trim();

        const dueDate =
            taskDueDate.value;


        if (taskText === "") {

            alert("Please enter a task.");

            return;

        }


        const newTask = {

            text: taskText,

            completed: false,

            dueDate: dueDate

        };


        tasks.push(newTask);

        saveTasks();

        displayTasks();


        taskInput.value = "";

        taskDueDate.value = "";

    }
);


// ====================
// ENTER KEY
// ====================

taskInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            addTaskButton.click();

        }

    }
);


// ====================
// TASK FILTERS
// ====================

const filterButtons =
    document.querySelectorAll(
        ".filter-button"
    );


filterButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            currentFilter =
                button.dataset.filter;


            filterButtons.forEach(
                function (button) {

                    button.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add(
                "active"
            );


            displayTasks();

        }
    );

});


// ====================
// POMODORO TIMER
// ====================

const WORK_TIME = 25 * 60;

const BREAK_TIME = 5 * 60;

let timeLeft = WORK_TIME;

let timerInterval = null;

let isWorkSession = true;


const timerDisplay =
    document.getElementById("timer");

const timerMode =
    document.getElementById("timerMode");

const startTimerButton =
    document.getElementById("startTimer");

const pauseTimerButton =
    document.getElementById("pauseTimer");

const resetTimerButton =
    document.getElementById("resetTimer");


// ====================
// TIMER DISPLAY
// ====================

function updateTimerDisplay() {

    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        timeLeft % 60;


    const formattedSeconds =
        seconds < 10
            ? "0" + seconds
            : seconds;


    timerDisplay.textContent =
        minutes + ":" + formattedSeconds;

}


// ====================
// TIMER MODE
// ====================

function updateTimerMode() {

    if (isWorkSession) {

        timerMode.textContent =
            "Work Session";

    } else {

        timerMode.textContent =
            "Break Time";

    }

}


// ====================
// SWITCH SESSION
// ====================

function switchSession() {

    clearInterval(timerInterval);

    timerInterval = null;

    isWorkSession =
        !isWorkSession;


    if (isWorkSession) {

        timeLeft = WORK_TIME;

        alert(
            "Break is over! Time to study. 📚"
        );

    } else {

        timeLeft = BREAK_TIME;

        alert(
            "Work session complete! Take a break. ☕"
        );

    }


    updateTimerMode();

    updateTimerDisplay();

}


// ====================
// START TIMER
// ====================

startTimerButton.addEventListener(
    "click",
    function () {

        if (timerInterval !== null) {

            return;

        }


        timerInterval =
            setInterval(
                function () {

                    if (timeLeft > 0) {

                        timeLeft--;

                        updateTimerDisplay();

                    } else {

                        switchSession();

                    }

                },
                1000
            );

    }
);


// ====================
// PAUSE TIMER
// ====================

pauseTimerButton.addEventListener(
    "click",
    function () {

        clearInterval(timerInterval);

        timerInterval = null;

    }
);


// ====================
// RESET TIMER
// ====================

resetTimerButton.addEventListener(
    "click",
    function () {

        clearInterval(timerInterval);

        timerInterval = null;

        isWorkSession = true;

        timeLeft = WORK_TIME;

        updateTimerMode();

        updateTimerDisplay();

    }
);


// ====================
// NOTES
// ====================

const notesElement =
    document.getElementById("notes");


const savedNotes =
    localStorage.getItem(
        "studentNotes"
    );


if (savedNotes !== null) {

    notesElement.value =
        savedNotes;

}


notesElement.addEventListener(
    "input",
    function () {

        localStorage.setItem(
            "studentNotes",
            notesElement.value
        );

    }
);


// ====================
// DARK MODE
// ====================

const themeToggle =
    document.getElementById(
        "themeToggle"
    );


const savedTheme =
    localStorage.getItem(
        "studentTheme"
    );


if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeToggle.textContent =
        "☀️ Light Mode";

}


themeToggle.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        if (
            document.body.classList.contains(
                "dark"
            )
        ) {

            localStorage.setItem(
                "studentTheme",
                "dark"
            );

            themeToggle.textContent =
                "☀️ Light Mode";

        } else {

            localStorage.setItem(
                "studentTheme",
                "light"
            );

            themeToggle.textContent =
                "🌙 Dark Mode";

        }

    }
);


// ====================
// INITIAL LOAD
// ====================

displayTasks();

updateTimerMode();

updateTimerDisplay();