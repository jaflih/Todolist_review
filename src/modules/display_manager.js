import { deleteTask, updateTask, updateStatus } from '../index.js';
import DragAndDrop from './drag_and_drop.js';

export default class DisplayManager {
  static reset = (element) => {
    element.innerHTML = '';
  };

  static displayTask = (parent, task) => {
    const taskDiv = DisplayManager.createHtml(parent, 'div', 'task');
    taskDiv.dataset.id = task.index;
    taskDiv.id = `task_${task.index}`;
    taskDiv.setAttribute('draggable', 'true');
    taskDiv.setAttribute('data-effectallowed', 'move');
    taskDiv.setAttribute('data-position', task.index - 1);
    taskDiv.setAttribute('data-id', task.index);

    taskDiv.addEventListener('dragstart', DragAndDrop.dragStartEvent);
    taskDiv.addEventListener('dragend', DragAndDrop.dragEndEvent);

    const taskInput = DisplayManager.createHtml(taskDiv, 'div', 'task_input');
    taskInput.addEventListener('keyup', (event) => {
      updateTask(event, task.index);
    });

    const input = DisplayManager.createHtml(taskInput, 'input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('class', `task_${task.index}_checkbox checkbox_task`);
    input.id = `checkbox_task_${task.index}`;
    input.dataset.id = task.index;
    input.addEventListener('change', () => {
      updateStatus(task.index);
    });
    input.addEventListener('click', () => {
      deleteTask(task.index);
    });

    const input2 = DisplayManager.createHtml(taskInput, 'input');
    input2.setAttribute('type', 'text');
    input2.setAttribute('class', `task_${task.index} input_task`);
    input2.dataset.id = task.index;
    input2.value = task.description;
    input2.id = `input_task_${task.index}`;
    input2.addEventListener('keyup', (event) => {
      updateTask(event, task.index);
    });
    input2.addEventListener('focusout', (event) => {
      updateTask(event, task.index, true);
    });

    const i = DisplayManager.createHtml(taskDiv, 'i', 'fas fa-ellipsis-v');
    i.setAttribute('class', 'fas fa-trash');
    i.id = `task_${task.index}`;
    i.dataset.id = task.index;
    i.addEventListener('click', () => {
      deleteTask(task.index);
    });
  };

  static createHtml = (parent, tag, className, content = null) => {
    const element = document.createElement(tag);
    element.className = className;
    element.innerHTML = content;
    parent.appendChild(element);
    return element;
  };
}
