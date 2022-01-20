import DragAndDrop from './drag_and_drop.js';
import TasksManager from './tasks_manager.js';
import { selector } from './tools.js';

export default class Todolist {
  constructor() {
    this.manager = new TasksManager();
    this.addTaskInput = selector('input');
    this.setup();
  }

  setup = () => {
    selector('.footer').addEventListener('click', () => {
      this.manager.clearCompleted();
      this.display();
    });

    this.addTaskInput.addEventListener('keyup', ({ key }) => {
      if (key === 'Enter') {
        this.createTask();
      }
    });

    selector('.fa-plus').addEventListener('click', () => this.createTask());

    const depot = document.querySelector('.depot');
    depot.addEventListener('dragenter', DragAndDrop.dragEnterEvent);
    depot.addEventListener('dragleave', DragAndDrop.dragLeaveEvent);
    depot.addEventListener('dragover', DragAndDrop.dragOverEvent);
    depot.addEventListener('drop', (event) => {
      DragAndDrop.dropEvent(event);
      this.manager.updateTasksPosition(depot.childNodes);
    });
  };

  display = () => {
    this.reset(selector('.tasks'));
    this.manager.getTasks().forEach((task) => this.displayTask(selector('.tasks'), task));
  };

  displayTask = (parent, task) => {
    const taskDiv = this.createHtml(parent, 'li', [
      ['id', `task_${task.index}`],
      ['class', 'task'],
      ['draggable', 'true'],
      ['data-effectallowed', 'move'],
      ['data-position', task.index - 1],
      ['data-id', task.index],
    ]);

    taskDiv.addEventListener('dragstart', DragAndDrop.dragStartEvent);
    taskDiv.addEventListener('dragend', DragAndDrop.dragEndEvent);

    const taskInput = this.createHtml(taskDiv, 'div', [['class', 'task_input']]);
    taskInput.addEventListener('keyup', (event) => {
      this.updateTask(event, task.index);
    });

    const completedCheckbox = this.createHtml(taskInput, 'input', [
      ['id', `checkbox_task_${task.index}`],
      ['type', 'checkbox'],
      ['class', `task_${task.index}_checkbox checkbox_task`],
      ['dataset.id', task.index],
    ]);
    completedCheckbox.checked = task.completed;

    completedCheckbox.addEventListener('change', () => {
      this.updateStatus(task.index);
    });

    const descriptionInput = this.createHtml(taskInput, 'input', [
      ['type', 'text'],
      ['class', `task_${task.index} input_task`],
      ['id', task.index],
      ['id', `input_task_${task.index}`],
    ]);
    descriptionInput.value = task.description;
    descriptionInput.addEventListener('keyup', (event) => {
      this.updateTask(event, task.index);
    });
    descriptionInput.addEventListener('focusout', (event) => {
      this.updateTask(event, task.index, true);
    });

    const removeIcon = this.createHtml(taskDiv, 'i', [
      ['class', 'fas fa-trash'],
      ['id', `task_${task.index}`],
      ['dataset.id', task.index],
    ]);

    removeIcon.addEventListener('click', () => {
      this.deleteTask(task.index);
    });
  };

  createHtml = (parent, tag, attributes = null, content = null) => {
    const element = document.createElement(tag);
    element.innerHTML = content;
    const mapAttributes = new Map(attributes);
    mapAttributes.forEach((value, key) => {
      element.setAttribute(key, value);
    });
    parent.appendChild(element);
    return element;
  };

  reset = (element) => {
    element.innerHTML = '';
  };

  updateTask = (event, index, focus = false) => {
    if (event.key === 'Enter' || focus) {
      this.manager.updateTask(index, selector(`.task_${index}`).value, selector(`.task_${index}_checkbox`).checked);
      selector('.add_task input').focus();
    }
  };

  updateStatus = (index) => {
    this.manager.updateStatus(index, selector(`.task_${index}_checkbox`).checked);
    selector(`.task[data-id='${index}'] .input_task`).classList.toggle('completed');
  };

  deleteTask = (index) => {
    this.manager.deleteTask(index);
    this.display();
  };

  createTask = () => {
    const task = this.manager.addTask(this.addTaskInput.value);
    this.displayTask(selector('.tasks'), task);
    this.addTaskInput.value = '';
    selector(`#input_task_${task.index}`).focus();
  };
}
