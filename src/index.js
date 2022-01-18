/* eslint-disable no-use-before-define */
import './style.css';
import TasksManager from './modules/tasks_manager.js';
import { selector } from './modules/tools.js';
import DragAndDrop from './modules/drag_and_drop.js';

const addTaskInput = selector('input');
const manager = new TasksManager();

const reset = (element) => {
  element.innerHTML = '';
};

const displayTask = (parent, task) => {
  const taskDiv = createHtml(parent, 'li', [
    ['id', `task_${task.index}`],
    ['class', 'task'],
    ['draggable', 'true'],
    ['data-effectallowed', 'move'],
    ['data-position', task.index - 1],
    ['data-id', task.index],
  ]);

  taskDiv.addEventListener('dragstart', DragAndDrop.dragStartEvent);
  taskDiv.addEventListener('dragend', DragAndDrop.dragEndEvent);

  const taskInput = createHtml(taskDiv, 'div', [['class', 'task_input']]);
  taskInput.addEventListener('keyup', (event) => {
    updateTask(event, task.index);
  });

  const completedCheckbox = createHtml(taskInput, 'input', [
    ['id', `checkbox_task_${task.index}`],
    ['type', 'checkbox'],
    ['class', `task_${task.index}_checkbox checkbox_task`],
    ['dataset.id', task.index],
  ]);
  completedCheckbox.checked = task.completed;

  completedCheckbox.addEventListener('change', () => {
    updateStatus(task.index);
  });

  const descriptionInput = createHtml(taskInput, 'input', [
    ['type', 'text'],
    ['class', `task_${task.index} input_task`],
    ['id', task.index],
    ['id', `input_task_${task.index}`],
  ]);
  descriptionInput.value = task.description;
  descriptionInput.addEventListener('keyup', (event) => {
    updateTask(event, task.index);
  });
  descriptionInput.addEventListener('focusout', (event) => {
    updateTask(event, task.index, true);
  });

  const removeIcon = createHtml(taskDiv, 'i', [
    ['class', 'fas fa-trash'],
    ['id', `task_${task.index}`],
    ['dataset.id', task.index],
  ]);

  removeIcon.addEventListener('click', () => {
    deleteTask(task.index);
  });
};

const createHtml = (parent, tag, attributes = null, content = null) => {
  const element = document.createElement(tag);
  element.innerHTML = content;
  const mapAttributes = new Map(attributes);
  mapAttributes.forEach((value, key) => {
    element.setAttribute(key, value);
  });
  parent.appendChild(element);
  return element;
};

const updateTask = (event, index, focus = false) => {
  if (event.key === 'Enter' || focus) {
    manager.updateTask(index, selector(`.task_${index}`).value, selector(`.task_${index}_checkbox`).checked);
    selector('.add_task input').focus();
  }
};

const updateStatus = (index) => {
  manager.updateStatus(index, selector(`.task_${index}_checkbox`).checked);
  selector(`.task[data-id='${index}'] .input_task`).classList.toggle('completed');
};

const display = () => {
  reset(selector('.tasks'));
  manager.getTasks().forEach((task) => displayTask(selector('.tasks'), task));
};

const deleteTask = (index) => {
  manager.deleteTask(index);
  display();
};

const createTask = () => {
  const task = manager.addTask(addTaskInput.value);
  displayTask(selector('.tasks'), task);
  addTaskInput.value = '';
  selector(`#input_task_${task.index}`).focus();
};

selector('.footer').addEventListener('click', () => {
  manager.clearCompleted();
  display();
});

addTaskInput.addEventListener('keyup', ({ key }) => {
  if (key === 'Enter') {
    createTask();
  }
});

selector('.fa-plus').addEventListener('click', () => createTask());

display();

const depot = document.querySelector('.depot');
depot.addEventListener('dragenter', DragAndDrop.dragEnterEvent);
depot.addEventListener('dragleave', DragAndDrop.dragLeaveEvent);
depot.addEventListener('dragover', DragAndDrop.dragOverEvent);
depot.addEventListener('drop', (event) => {
  DragAndDrop.dropEvent(event);
  manager.updateTasksPosition(depot.childNodes);
});
