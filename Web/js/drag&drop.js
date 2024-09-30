export function uncompDragStart(event) {
    event.target.classList.add('hold');

    const tasks = document.querySelectorAll(".done-task");

    tasks.forEach((element) => (element.classList.add("shake")));
}

export function uncompDragEnd(event) {
    event.target.classList.remove('hold');

    const tasks = document.querySelectorAll(".done-task");
    tasks.forEach((element) => (element.classList.remove("shake")));
}

export function compDragStart(event) {
    event.target.classList.add('hold');

    const tasks = document.querySelectorAll(".not-done-task");

    tasks.forEach((element) => (element.classList.add("shake")));
}

export function compDragEnd(event) {
    event.target.classList.remove('hold');

    const tasks = document.querySelectorAll(".not-done-task");
    tasks.forEach((element) => (element.classList.remove("shake")));
}

// всё ниже взял с хабра
export function uncompDragOver(event) {
    event.preventDefault();

    const activeElement = document.querySelector(".hold");

    const currentElement = event.target;

    if (!(activeElement !== currentElement && currentElement.classList.contains("done-task") && activeElement.classList.contains("done-task"))) return;

    const nextElement = getNextElement(event.clientY, currentElement);

    if (nextElement && activeElement === nextElement.previousElementSibling || activeElement === nextElement) return;
    
    document.querySelector('.not-completed-container').insertBefore(activeElement, nextElement);
}

export function compDragOver(event) {
    event.preventDefault();

    const activeElement = document.querySelector(".hold");

    const currentElement = event.target;

    if (!(activeElement !== currentElement && currentElement.classList.contains("not-done-task") && activeElement.classList.contains("not-done-task"))) return;

    const nextElement = getNextElement(event.clientY, currentElement);

    if (nextElement && activeElement === nextElement.previousElementSibling || activeElement === nextElement) return;
    
    document.querySelector('.completed-container').insertBefore(activeElement, nextElement);
}

function getNextElement(cursorPosition, currentElement) {
    const currentElementCoord = currentElement.getBoundingClientRect();

    const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

    const nextElement = (cursorPosition < currentElementCenter) ? currentElement : currentElement.nextElementSibling;

    return nextElement;
}
