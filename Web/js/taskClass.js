export class Task {
    constructor(description, completed = false) {
        this.description = description;
        this.completed = completed;
    }

    changeStatus() {
        this.completed = !this.completed;
    }

    getDescription() {
        return this.description;
    }
}
