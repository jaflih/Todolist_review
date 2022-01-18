import Task from './task.js';
import StorageManager from './storage_manager.js';
import StatusManager from './status_manager.js';

export default class TasksManager {
  constructor() {
    this.tasks = StorageManager.load();
  }

  getTasks = () => this.tasks.sort((a, b) => a.index - b.index);

  getTask = (index) => this.tasks[index - 1];

  addTask = (description, completed = false) => {
    this.tasks.push(new Task(this.tasks.length + 1, description, completed));
    StorageManager.save(this.tasks);
    return this.getTask(this.tasks.length);
  };

  deleteTask = (index) => {
    const taskIndex = index - 1;
    this.tasks.splice(taskIndex, 1);
    this.tasks
      .filter((task) => task.index > taskIndex)
      .forEach((task) => {
        task.index -= 1;
      });
    StorageManager.save(this.tasks);
  };

  updateTask = (index, description, completed) => {
    this.getTask(index).description = description;
    this.getTask(index).completed = completed;
    StorageManager.save(this.tasks);
  };

  updateStatus = (index, status) => {
    StatusManager.updateStatus(this.getTask(index), status);
    StorageManager.save(this.tasks);
  };

  updateTasksPosition(tab) {
    const newTasks = [];
    tab.forEach((node) => {
      const task = this.getTask(node.dataset.id);
      task.index = Number.parseInt(node.dataset.position, 10) + 1;
      node.dataset.id = task.index;
      newTasks.push(task);
    });
    this.tasks = newTasks;
    StorageManager.save(this.tasks);
  }

  clearCompleted = () => {
    this.tasks = this.tasks.filter((task) => task.completed === false);
    this.tasks.forEach((task, index) => {
      task.index = index + 1;
    });
    StorageManager.save(this.tasks);
  };
}
