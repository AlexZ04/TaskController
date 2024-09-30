import { Task } from "./taskClass.js";
import { sendToast } from "./sendToast.js";
import { uncompDragStart, uncompDragEnd, compDragStart, compDragEnd, compDragOver, uncompDragOver } from "./drag&drop.js";
import * as connector from "./noteConnection.js";

const emptyContainer = document.querySelector(".empty-tasks-container");
const notCompletedContainer = document.querySelector(".not-completed-container");
const completedContainer = document.querySelector(".completed-container");

const createTaskDialog = document.getElementById("create-dialog");
const editTaskDialog = document.getElementById("edit-dialog");

const taskDescriptions = document.querySelectorAll(".task-description");

document.getElementById("add-task").addEventListener("click", () =>  {
    openCreateTask();
});

document.getElementById("submit-create").addEventListener("click", async () => {
    const taskText = document.getElementById("task-text").value;
    const isChecked = document.getElementById("is-completed").checked;

    if (taskText !== "") {
        await connector.addNote({text: taskText, isCompleted: isChecked});

        document.getElementById("task-text").value = "";
        document.getElementById("is-completed").checked = false;
        closeCreateTask();

        setTasks();
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

document.getElementById("submit-edit").addEventListener("click", async () => {
    const newVal = document.getElementById("task-edit-text").value;
    if (newVal !== "") {
        await connector.changeNote(editingTaskInd, {text: newVal, isCompleted: false});
        setTasks();
        closeEditTask();
    }
    else {
        sendToast("Текст заметки не может быть пустым!");
    }
})

let editingTaskInd = 0;

async function taskChange(event) {
    if (event.target.dataset.index) {
        const index = Number(event.target.dataset.index);
        const type = event.target.dataset.type;

        if (type === "remove") {
            await connector.deleteNote(index);
            setTasks();
        }
        else if (type === "check") {
            await connector.checkNote(index);
            setTasks();
        }
        else if (type === "edit") {
            var data = await connector.fetchOneNote(index)
            document.getElementById("task-edit-text").value = data["text"];
            editingTaskInd = index;
            openEditTask();
        }

    }
}

notCompletedContainer.addEventListener('click', (event) => taskChange(event));
completedContainer.addEventListener('click', (event) => taskChange(event));

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
function getTaskCode(task, completed = false) {
    let code = "";
    if (!completed) {
        code += `<div class="task-text">${task.getDescription()}</div>`;
    }
    else {
        code += `<div class="task-text done">${task.getDescription()}</div>`;
    }

    code += `<span class="task-buttons">`;

    if (!completed) {
        code += `<button class="edit-button" data-index="${task.getId()}" data-type="edit"></button>`
    }

    code += `<button class="remove-button" data-index="${task.getId()}" data-type="remove"></button>`;
    
    if (!completed) {
        code += `<input type="checkbox" data-index="${task.getId()}" data-type="check" class="real-checkbox" id="checkbox${task.getId()}"></input>`;
        code += `<label class="custom-checkbox" for="checkbox${task.getId()}"></label>`;
    } 
    else {
        code += `<input type="checkbox" checked data-index="${task.getId()}" data-type="check" name="check" class="real-checkbox" id="checkbox${task.getId()}"></input>`;
        code += `<label class="custom-checkbox" for="checkbox${task.getId()}"></label>`;
    }

    code += "</span>";

    return code;
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
async function setTasks() {
    document.querySelector(".not-completed-container").innerHTML = "";
    document.querySelector(".completed-container").innerHTML = "";

    completedTasks, uncompletedTasks = await divideFetchedNotes();

    checkContainers();

    for (let i = 0; i < uncompletedTasks.length; i++) {
        const newListItem = document.createElement('li');
        newListItem.innerHTML = getTaskCode(uncompletedTasks[i]);
        newListItem.className = "task done-task";
        newListItem.draggable = true;

        newListItem.addEventListener("dragstart", uncompDragStart);
        newListItem.addEventListener("dragend", uncompDragEnd);
        newListItem.addEventListener("dragover", uncompDragOver);

        document.querySelector(".not-completed-container").appendChild(newListItem);
    }

    for (let i = 0; i < completedTasks.length; i++) {
        const newListItem = document.createElement('li');
        newListItem.innerHTML = getTaskCode(completedTasks[i], true);
        newListItem.className = "task not-done-task";
        newListItem.draggable = true;

        newListItem.addEventListener("dragstart", compDragStart);
        newListItem.addEventListener("dragend", compDragEnd);
        newListItem.addEventListener("dragover", compDragOver);

        document.querySelector(".completed-container").appendChild(newListItem);
    }
}

let completedTasks = [];
let uncompletedTasks = [];

async function divideFetchedNotes() {
    var data = await connector.fetchNotes();

    completedTasks = []
    uncompletedTasks = []

    data.forEach(elem => {
        if (elem["isCompleted"])  {
            completedTasks.push(new Task(elem["id"], elem["text"], true));
        }
        else {
            uncompletedTasks.push(new Task(elem["id"], elem["text"]));
        }
    });

    return completedTasks, uncompletedTasks
}
// старт
setTasks();


document.getElementById("save").onclick = async function() {
    let tempList = [];

    document.querySelector(".not-completed-container").childNodes.forEach(elem => {
        tempList.push(new Task(elem.childNodes[0].textContent));
    });

    document.querySelector(".completed-container").childNodes.forEach(elem => {
        tempList.push(new Task(elem.childNodes[0].textContent, true));
    });

    const data = JSON.stringify(await connector.fetchNotes());

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

        reader.onload = async function() {
            const data = JSON.parse(reader.result);

            await connector.uploadNotes(data);

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