const taskInput = document.getElementById("taskInput");
const taskDueDate = document.getElementById("taskDueDate");
const taskPriority = document.getElementById("taskPriority");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const taskSearch = document.getElementById("taskSearch");

const totalTasksElement =
    document.getElementById("totalTasks");

const completedTasksElement =
    document.getElementById("completedTasks");

const progressPercentageElement =
    document.getElementById("progressPercentage");

const progressBar =
    document.getElementById("progressBar");

const progressMessage =
    document.getElementById("progressMessage");


// ====================
// TASK DATA
// ====================

let tasks =
    JSON.parse(
        localStorage.getItem("studentTasks")
    ) || [];

let currentFilter = "all";

let currentSearch = "";


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
// CHECK OVERDUE
// ====================

function isOverdue(taskData) {

    if (!taskData.dueDate || taskData.completed) {
        return false;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const dueDate =
        new Date(
            taskData.dueDate + "T00:00:00"
        );

    return dueDate < today;

}


// ====================
// PRIORITY VALUE
// ====================

function getPriorityValue(priority) {

    if (priority === "high") {
        return 1;
    }

    if (priority === "medium") {
        return 2;
    }

    return 3;

}


// ====================
// PRIORITY LABEL
// ====================

function getPriorityLabel(priority) {

    if (priority === "high") {
        return "🔴 High";
    }

    if (priority === "medium") {
        return "🟡 Medium";
    }

    return "🟢 Low";

}


// ====================
// DISPLAY TASKS
// ====================

function displayTasks() {

    taskList.innerHTML = "";


    const sortedTasks =
        [...tasks].sort(function (a, b) {

            return (
                getPriorityValue(
                    a.priority || "medium"
                ) -
                getPriorityValue(
                    b.priority || "medium"
                )
            );

        });


    sortedTasks.forEach(function (taskData) {

        const originalIndex =
            tasks.indexOf(taskData);


        // FILTER

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


        // SEARCH

        if (
            currentSearch &&
            !taskData.text
                .toLowerCase()
                .includes(currentSearch)
        ) {
            return;
        }


        const task =
            document.createElement("li");


        if (taskData.completed) {

            task.classList.add("completed");

        }


        if (isOverdue(taskData)) {

            task.classList.add("overdue");

        }


        const taskContent =
            document.createElement("div");

        taskContent.classList.add(
            "task-content"
        );


        // TASK TEXT

        const taskTextElement =
            document.createElement("span");

        taskTextElement.textContent =
            taskData.text;


        taskTextElement.addEventListener(
            "click",
            function () {

                const wasCompleted =
                    taskData.completed;

                taskData.completed =
                    !taskData.completed;


                saveTasks();

                displayTasks();


                // Celebration

                if (!wasCompleted &&
                    taskData.completed) {

                    showCompletionMessage();

                }

            }
        );


        taskContent.appendChild(
            taskTextElement
        );


        // PRIORITY

        const priorityElement =
            document.createElement("small");

        priorityElement.textContent =
            getPriorityLabel(
                taskData.priority || "medium"
            );

        priorityElement.classList.add(
            "task-priority"
        );


        taskContent.appendChild(
            priorityElement
        );


        // DUE DATE

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


        // OVERDUE

        if (isOverdue(taskData)) {

            const overdueElement =
                document.createElement("small");

            overdueElement.textContent =
                "⚠️ Overdue";

            overdueElement.classList.add(
                "overdue-label"
            );

            taskContent.appendChild(
                overdueElement
            );

        }


        // DELETE

        const deleteButton =
            document.createElement("button");

        deleteButton.textContent =
            "Delete";


        deleteButton.addEventListener(
            "click",
            function () {

                tasks.splice(
                    originalIndex,
                    1
                );

                saveTasks();

                displayTasks();

            }
        );


        task.appendChild(
            taskContent
        );

        task.appendChild(
            deleteButton
        );

        taskList.appendChild(
            task
        );

    });


    updateStatistics();

}


// ====================
// STATISTICS + PROGRESS
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


    // Progress bar

    progressBar.style.width =
        progress + "%";


    // Progress message

    if (totalTasks === 0) {

        progressMessage.textContent =
            "Add some tasks to get started! 🚀";

    } else if (progress === 0) {

        progressMessage.textContent =
            "Let's get started! 💪";

    } else if (progress < 50) {

        progressMessage.textContent =
            "Good start! Keep going! 🔥";

    } else if (progress < 100) {

        progressMessage.textContent =
            "You're doing great! Almost there! 🚀";

    } else {

        progressMessage.textContent =
            "All tasks completed! 🎉🏆";

    }

}


// ====================
// COMPLETION MESSAGE
// ====================

function showCompletionMessage() {

    const message =
        document.createElement("div");

    message.classList.add(
        "completion-message"
    );

    message.textContent =
        "Task completed! 🎉";


    document.body.appendChild(
        message
    );


    setTimeout(function () {

        message.remove();

    }, 2000);

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

        const priority =
            taskPriority.value;


        if (taskText === "") {

            alert("Please enter a task.");

            return;

        }


        const newTask = {

            text: taskText,

            completed: false,

            dueDate: dueDate,

            priority: priority

        };


        tasks.push(newTask);

        saveTasks();

        displayTasks();


        taskInput.value = "";

        taskDueDate.value = "";

        taskPriority.value =
            "medium";

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
// SEARCH
// ====================

taskSearch.addEventListener(
    "input",
    function () {

        currentSearch =
            taskSearch.value
                .toLowerCase()
                .trim();

        displayTasks();

    }
);


// ====================
// FILTERS
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
// STUDY STREAK
// ====================

const studyStreakElement =
    document.getElementById(
        "studyStreak"
    );

let studyStreak =
    Number(
        localStorage.getItem(
            "studyStreak"
        )
    ) || 0;

let lastStudyDate =
    localStorage.getItem(
        "lastStudyDate"
    );


function getTodayDate() {

    const today =
        new Date();

    return today
        .toISOString()
        .split("T")[0];

}


function updateStudyStreak() {

    const today =
        getTodayDate();


    if (lastStudyDate === today) {

        return;

    }


    if (lastStudyDate === null) {

        studyStreak = 1;

    } else {

        const lastDate =
            new Date(
                lastStudyDate
            );

        const currentDate =
            new Date(today);


        const difference =
            Math.floor(
                (
                    currentDate -
                    lastDate
                ) /
                (1000 * 60 * 60 * 24)
            );


        if (difference === 1) {

            studyStreak++;

        } else {

            studyStreak = 1;

        }

    }


    lastStudyDate =
        today;


    localStorage.setItem(
        "studyStreak",
        studyStreak
    );


    localStorage.setItem(
        "lastStudyDate",
        lastStudyDate
    );

}


function displayStudyStreak() {

    studyStreakElement.textContent =
        studyStreak +
        " day" +
        (
            studyStreak === 1
                ? ""
                : "s"
        );

}


updateStudyStreak();

displayStudyStreak();


// ====================
// POMODORO
// ====================

const WORK_TIME =
    25 * 60;

const BREAK_TIME =
    5 * 60;

let timeLeft =
    WORK_TIME;

let timerInterval =
    null;

let isWorkSession =
    true;


const timerDisplay =
    document.getElementById(
        "timer"
    );

const timerMode =
    document.getElementById(
        "timerMode"
    );

const startTimerButton =
    document.getElementById(
        "startTimer"
    );

const pauseTimerButton =
    document.getElementById(
        "pauseTimer"
    );

const resetTimerButton =
    document.getElementById(
        "resetTimer"
    );


function updateTimerDisplay() {

    const minutes =
        Math.floor(
            timeLeft / 60
        );

    const seconds =
        timeLeft % 60;


    const formattedSeconds =
        seconds < 10
            ? "0" + seconds
            : seconds;


    timerDisplay.textContent =
        minutes +
        ":" +
        formattedSeconds;

}


function updateTimerMode() {

    if (isWorkSession) {

        timerMode.textContent =
            "Work Session";

    } else {

        timerMode.textContent =
            "Break Time";

    }

}


function switchSession() {

    clearInterval(
        timerInterval
    );

    timerInterval =
        null;

    isWorkSession =
        !isWorkSession;


    if (isWorkSession) {

        timeLeft =
            WORK_TIME;

        alert(
            "Break is over! Time to study. 📚"
        );

    } else {

        timeLeft =
            BREAK_TIME;

        alert(
            "Work session complete! Take a break. ☕"
        );

    }


    updateTimerMode();

    updateTimerDisplay();

}


startTimerButton.addEventListener(
    "click",
    function () {

        if (
            timerInterval !== null
        ) {

            return;

        }


        timerInterval =
            setInterval(
                function () {

                    if (
                        timeLeft > 0
                    ) {

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


pauseTimerButton.addEventListener(
    "click",
    function () {

        clearInterval(
            timerInterval
        );

        timerInterval =
            null;

    }
);


resetTimerButton.addEventListener(
    "click",
    function () {

        clearInterval(
            timerInterval
        );

        timerInterval =
            null;

        isWorkSession =
            true;

        timeLeft =
            WORK_TIME;

        updateTimerMode();

        updateTimerDisplay();

    }
);


// ====================
// NOTES
// ====================

const notesElement =
    document.getElementById(
        "notes"
    );

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

    document.body.classList.add(
        "dark"
    );

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