export class Task {
    constructor(id, description, completed = false) {
        this.id = id;
        this.description = description;
        this.completed = completed;
    }

    changeStatus() {
        this.completed = !this.completed;
    }

    getDescription() {
        return this.description;
    }

    getId() {
        return this.id;
    }
}
