import {
  selector, hasClass, addClass, removeClass,
} from './tools.js';

let lastElBrowsed;

export default class DragAndDrop {
  static dragStartEvent = (evt) => {
    addClass(evt.target, 'dragStart');
    evt.dataTransfer.setData('tex/html', evt.target.id);
  };

  static dragEndEvent = (evt) => {
    removeClass(evt.target, 'dragStart');
  };

  static dragEnterEvent = (evt) => {
    if (!hasClass(evt.target, 'input_task') && !hasClass(evt.target, 'task_input')) {
      addClass(evt.target, 'dragSurvol');
    }
  };

  static dragLeaveEvent = (evt) => {
    removeClass(evt.target, 'dragSurvol');
  };

  static dragOverEvent = (evt) => {
    if (hasClass(evt.target, 'task')) {
      lastElBrowsed = evt.target;
    }
    evt.preventDefault();
  };

  static dropEvent = (evt) => {
    if (evt.currentTarget.contains(evt.relatedTarget)) {
      return;
    }
    if (evt.target.id !== 'depot') {
      const dt = evt.dataTransfer;
      const elToMove = selector(`#${dt.getData('tex/html')}`);
      const items = document.querySelectorAll('.task');

      if (elToMove.dataset.position - lastElBrowsed.dataset.position === 1) {
        const old = elToMove.dataset.position;
        lastElBrowsed.before(elToMove);
        elToMove.dataset.position = lastElBrowsed.dataset.position;
        lastElBrowsed.dataset.position = old;
      } else if (elToMove.dataset.position - lastElBrowsed.dataset.position === -1) {
        lastElBrowsed.after(elToMove);
        const old = elToMove.dataset.position;
        elToMove.dataset.position = lastElBrowsed.dataset.position;
        lastElBrowsed.dataset.position = old;
      } else if (elToMove.dataset.position - lastElBrowsed.dataset.position > 1) {
        const min = lastElBrowsed.dataset.position;
        const max = elToMove.dataset.position;

        lastElBrowsed.before(elToMove);

        items.forEach((item) => {
          const { position } = item.dataset;

          if (min <= position && position <= max) {
            if (item.id === elToMove.id) {
              item.dataset.position = min;
            } else {
              const newPosition = Number.parseInt(position, 10) + 1;
              item.dataset.position = newPosition;
            }
          }
        });
      } else if (elToMove.dataset.position - lastElBrowsed.dataset.position < 1) {
        const max = lastElBrowsed.dataset.position;
        const min = elToMove.dataset.position;

        lastElBrowsed.after(elToMove);

        for (let i = 0; i < items.length; i += 1) {
          const item = items[i];
          const { position } = item.dataset;

          if (min <= position && position <= max) {
            if (item.id === elToMove.id) {
              item.dataset.position = max;
            } else {
              const newPosition = Number.parseInt(position, 10) - 1;
              item.dataset.position = newPosition;
            }
          }
        }
      }

      removeClass(lastElBrowsed, 'dragSurvol');
    }
  };
}
