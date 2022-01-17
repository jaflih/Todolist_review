/* eslint-disable no-use-before-define */
import './style.css';
import TasksManager from './modules/tasks_manager.js';
import { selector } from './modules/tools.js';
import DragAndDrop from './modules/drag_and_drop.js';

const input = selector('input');
const manager = new TasksManager();

const reset = (element) => {
  element.innerHTML = '';
};

const displayTask = (parent, task) => {
  const taskDiv = createHtml(parent, 'li', 'task');
  taskDiv.dataset.id = task.index;
  taskDiv.id = `task_${task.index}`;
  taskDiv.setAttribute('draggable', 'true');
  taskDiv.setAttribute('data-effectallowed', 'move');
  taskDiv.setAttribute('data-position', task.index - 1);
  taskDiv.setAttribute('data-id', task.index);
  taskDiv.addEventListener('dragstart', DragAndDrop.dragStartEvent);
  taskDiv.addEventListener('dragend', DragAndDrop.dragEndEvent);

  const taskInput = createHtml(taskDiv, 'div', 'task_input');
  taskInput.addEventListener('keyup', (event) => {
    updateTask(event, task.index);
  });

  const completedCheckbox = createHtml(taskInput, 'input');
  completedCheckbox.setAttribute('type', 'checkbox');
  completedCheckbox.setAttribute('class', `task_${task.index}_checkbox checkbox_task`);
  completedCheckbox.id = `checkbox_task_${task.index}`;
  completedCheckbox.dataset.id = task.index;
  completedCheckbox.addEventListener('change', () => {
    updateStatus(task.index);
  });
  completedCheckbox.addEventListener('click', () => {
    deleteTask(task.index);
  });

  const descriptionInput = createHtml(taskInput, 'input');
  descriptionInput.setAttribute('type', 'text');
  descriptionInput.setAttribute('class', `task_${task.index} input_task`);
  descriptionInput.dataset.id = task.index;
  descriptionInput.value = task.description;
  descriptionInput.id = `input_task_${task.index}`;
  descriptionInput.addEventListener('keyup', (event) => {
    updateTask(event, task.index);
  });
  descriptionInput.addEventListener('focusout', (event) => {
    updateTask(event, task.index, true);
  });

  const removeIcon = createHtml(taskDiv, 'i', 'fas fa-ellipsis-v');
  removeIcon.setAttribute('class', 'fas fa-trash');
  removeIcon.id = `task_${task.index}`;
  removeIcon.dataset.id = task.index;
  removeIcon.addEventListener('click', () => {
    deleteTask(task.index);
  });
};

const createHtml = (parent, tag, className, content = null) => {
  const element = document.createElement(tag);
  element.className = className;
  element.innerHTML = content;
  parent.appendChild(element);
  return element;
};

export const updateTask = (event, index, focus = false) => {
  if (event.key === 'Enter' || focus) {
    manager.updateTask(index, selector(`.task_${index}`).value, selector(`.task_${index}_checkbox`).checked);
    selector('.add_task input').focus();
  }
};

export const updateStatus = (index) => {
  manager.updateStatus(index, selector(`.task_${index}_checkbox`).checked);
  selector(`.task[data-id='${index}'] .input_task`).classList.toggle('completed');
};

const display = () => {
  reset(selector('.tasks'));
  manager.getTasks().forEach((task) => displayTask(selector('.tasks'), task));
};

export const deleteTask = (index) => {
  manager.deleteTask(index);
  display();
};

const createTask = () => {
  const task = manager.addTask(input.value);
  displayTask(selector('.tasks'), task);
  input.value = '';
  selector(`#input_task_${task.index}`).focus();
};

selector('.footer').addEventListener('click', () => {
  manager.clearCompleted();
  display();
});

input.addEventListener('keyup', ({ key }) => {
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
