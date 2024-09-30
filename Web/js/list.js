import { Task } from "./taskClass.js";
import { sendToast } from "./sendToast.js";
import { uncompDragStart, uncompDragEnd, compDragStart, compDragEnd, compDragOver, uncompDragOver } from "./drag&drop.js";

const emptyContainer = document.querySelector(".empty-tasks-container");
const notCompletedContainer = document.querySelector(".not-completed-container");
const completedContainer = document.querySelector(".completed-container");
const createTaskContainer = document.querySelector(".create-task-container");
const editTaskContainer = document.querySelector(".edit-task-container");

const createTaskDialog = document.getElementById("create-dialog");
const editTaskDialog = document.getElementById("edit-dialog");

const taskDescriptions = document.querySelectorAll(".task-description");

document.getElementById("add-task").addEventListener("click", () =>  {
    openCreateTask();
});

document.getElementById("submit-create").addEventListener("click", () => {
    const taskText = document.getElementById("task-text").value;
    const isCompleted = document.getElementById("is-completed").checked;

    if (taskText !== "") {
        addTask(new Task(taskText), isCompleted);

        document.getElementById("task-text").value = "";
        document.getElementById("is-completed").checked = false;
        closeCreateTask();
    }
    else {
        sendToast("Введите текст!");
    }

});

document.getElementById("cancel").addEventListener("click", () => {
    document.getElementById("task-text").value = "";
    closeCreateTask();
});

document.getElementById("cancel-edit").addEventListener("click", () => {
    closeEditTask();
});

document.getElementById("submit-edit").addEventListener("click", () => {
    const newVal = document.getElementById("task-edit-text").value;
    if (newVal !== "") {
        uncompletedTasks[editingTaskInd] = new Task(newVal);
        setTasks();
        closeEditTask();
    }
    else {
        sendToast("Текст заметки не может быть пустым!");
    }
})

let editingTaskInd = 0;

notCompletedContainer.onclick = function(event) {
    if (event.target.dataset.index) {
        const index = Number(event.target.dataset.index);
        const type = event.target.dataset.type;

        if (type === "remove") {
            uncompletedTasks.splice(index, 1);
            setTasks();
        }
        else if (type === "check") {
            const task = uncompletedTasks[index];
            task.changeStatus();
            uncompletedTasks.splice(index, 1);
            completedTasks.push(task);
            setTasks();
        }
        else if (type === "edit") {
            document.getElementById("task-edit-text").value = uncompletedTasks[index].getDescription();
            editingTaskInd = index;
            openEditTask();
        }

    }
}

completedContainer.onclick = function(event) {
    if (event.target.dataset.index) {
        const index = Number(event.target.dataset.index);
        const type = event.target.dataset.type;

        if (type === "remove") {
            completedTasks.splice(index, 1);
            setTasks();
        }
        else if (type === "check") {
            const task = completedTasks[index];
            task.changeStatus();
            completedTasks.splice(index, 1);
            uncompletedTasks.push(task);
            setTasks();
        }

    }
}

let completedTasks = [];
let uncompletedTasks = [];

// открытие и закрытие окошек создания и редактирования дел
function openCreateTask() {
    createTaskDialog.showModal();
}

function closeCreateTask() {
    createTaskDialog.close();
}

function openEditTask() {
    editTaskDialog.showModal();
}

function closeEditTask() {
    editTaskDialog.close();
}

// получить html-код элемента дела
function getTaskCode(task, index, completed = false) {
    let code = "";
    if (!completed) {
        code += `<div class="task-text">${task.getDescription()}</div>`;
    }
    else {
        code += `<div class="task-text done">${task.getDescription()}</div>`;
    }

    code += `<span class="task-buttons">`;

    if (!completed) {
        code += `<button class="edit-button" data-index="${index}" data-type="edit"></button>`
    }

    code += `<button class="remove-button" data-index="${index}" data-type="remove"></button>`;
    
    if (!completed) {
        code += `<input type="checkbox" data-index="${index}" data-type="check" class="real-checkbox" id="checkbox${index}"></input>`;
        code += `<label class="custom-checkbox" for="checkbox${index}"></label>`;
    } 
    else {
        code += `<input type="checkbox" checked data-index="${index}" data-type="check" name="check" class="real-checkbox" id="checkbox${uncompletedTasks.length + index}"></input>`;
        code += `<label class="custom-checkbox" for="checkbox${uncompletedTasks.length + index}"></label>`;
    }

    code += "</span>";

    return code;
}

// добавить дело в общий список
function addTask(task, isCompleted) {
    if (!isCompleted) {
        uncompletedTasks.push(task);
    }
    else {
        completedTasks.push(task);
    }
    
    setTasks();
}

// если никаких дел ещё не создано - написать об этом 
function checkContainers() {
    if (completedTasks.length + uncompletedTasks.length === 0) {
        notCompletedContainer.style.display = "none";
        completedContainer.style.display = "none";
        emptyContainer.style.display = "block";

        taskDescriptions.forEach(elem => elem.style.display = "none");

    } else {
        notCompletedContainer.style.display = "block";
        completedContainer.style.display = "block";
        emptyContainer.style.display = "none";

        taskDescriptions.forEach(elem => elem.style.display = "block");
    }
}

// отображение списка дел
function setTasks() {
    document.querySelector(".not-completed-container").innerHTML = "";
    document.querySelector(".completed-container").innerHTML = "";

    checkContainers();

    for (let i = 0; i < uncompletedTasks.length; i++) {
        const newListItem = document.createElement('li');
        newListItem.innerHTML = getTaskCode(uncompletedTasks[i], i);
        newListItem.className = "task done-task";
        newListItem.draggable = true;

        newListItem.addEventListener("dragstart", uncompDragStart);
        newListItem.addEventListener("dragend", uncompDragEnd);
        newListItem.addEventListener("dragover", uncompDragOver);

        document.querySelector(".not-completed-container").appendChild(newListItem);
    }

    for (let i = 0; i < completedTasks.length; i++) {
        const newListItem = document.createElement('li');
        newListItem.innerHTML = getTaskCode(completedTasks[i], i, true);
        newListItem.className = "task not-done-task";
        newListItem.draggable = true;

        newListItem.addEventListener("dragstart", compDragStart);
        newListItem.addEventListener("dragend", compDragEnd);
        newListItem.addEventListener("dragover", compDragOver);

        document.querySelector(".completed-container").appendChild(newListItem);
    }
}

// старт
setTasks();


document.getElementById("save").onclick = function() {
    let tempList = [];

    document.querySelector(".not-completed-container").childNodes.forEach(elem => {
        tempList.push(new Task(elem.childNodes[0].textContent));
    });

    document.querySelector(".completed-container").childNodes.forEach(elem => {
        tempList.push(new Task(elem.childNodes[0].textContent, true));
    });

    const data = JSON.stringify(tempList);

    const blob = new Blob([data], {type: "application/json"});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tasks.json';
    link.click();
    URL.revokeObjectURL(link.href);
};


document.getElementById("text-input").addEventListener("change", handleFiles);

function handleFiles() {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();

        reader.readAsText(file);

        reader.onload = function() {
            const data = JSON.parse(reader.result);

            completedTasks = []
            uncompletedTasks = []

            data.forEach(elem => {
                if (elem["completed"])  {
                    completedTasks.push(new Task(elem["description"], true));
                }
                else {
                    uncompletedTasks.push(new Task(elem["description"]));
                }
            });

            setTasks();

        };
    }
    this.value = "";

}

const infoDialog = document.getElementById("info-dialog");

document.getElementById("info-button").addEventListener("click", () => {
    infoDialog.showModal();
});

document.getElementById("close-dialog").addEventListener("click", () => {
    infoDialog.close();
});