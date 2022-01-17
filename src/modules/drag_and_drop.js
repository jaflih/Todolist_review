import {
  selector, hasClass, addClass, removeClass,
} from './tools.js';

let dernierElementParcouru;

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
      dernierElementParcouru = evt.target;
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

      if (elToMove.dataset.position - dernierElementParcouru.dataset.position === 1) {
        const old = elToMove.dataset.position;
        dernierElementParcouru.before(elToMove);
        elToMove.dataset.position = dernierElementParcouru.dataset.position;
        dernierElementParcouru.dataset.position = old;
      } else if (elToMove.dataset.position - dernierElementParcouru.dataset.position === -1) {
        dernierElementParcouru.after(elToMove);
        const old = elToMove.dataset.position;
        elToMove.dataset.position = dernierElementParcouru.dataset.position;
        dernierElementParcouru.dataset.position = old;
      } else if (elToMove.dataset.position - dernierElementParcouru.dataset.position > 1) {
        const min = dernierElementParcouru.dataset.position;
        const max = elToMove.dataset.position;

        dernierElementParcouru.before(elToMove);

        for (let i = 0; i < items.length; i += 1) {
          const e = items[i];
          const { position } = e.dataset;

          if (min <= position && position <= max) {
            if (e.id === elToMove.id) {
              e.dataset.position = min;
            } else {
              const w = Number.parseInt(position, 10) + 1;
              e.dataset.position = w;
            }
          }
        }
      } else if (elToMove.dataset.position - dernierElementParcouru.dataset.position < 1) {
        const max = dernierElementParcouru.dataset.position;
        const min = elToMove.dataset.position;

        dernierElementParcouru.after(elToMove);

        for (let i = 0; i < items.length; i += 1) {
          const e = items[i];
          const { position } = e.dataset;

          if (min <= position && position <= max) {
            if (e.id === elToMove.id) {
              e.dataset.position = max;
            } else {
              const w = Number.parseInt(position, 10) - 1;
              e.dataset.position = w;
            }
          }
        }
      }

      removeClass(dernierElementParcouru, 'dragSurvol');
    }
  };
}
