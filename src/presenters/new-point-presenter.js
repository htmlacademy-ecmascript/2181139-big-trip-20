import {remove, render} from '../framework/render.js';
import {UserAction, UpdateType} from '../utils/const.js';
import EditPointView from '../view/edit-point-view.js';
import { RenderPosition } from '../framework/render.js';

export default class NewPointPresenter {
  #container = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #newPointView = null;

  constructor({container, onDataChange, onDestroy}) {
    this.#container = container;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#newPointView !== null) {
      return;
    }
    this.#newPointView = new EditPointView({
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick
    });

    render(this.#newPointView, this.#container, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#newPointView === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#newPointView);
    this.#newPointView = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = async (point) => {
    await this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {...point},
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  setSaving() {
    this.#newPointView.updateElement({
      isSaving: true,
    });
  }

  handleError() {
    this.#newPointView.shake(() => {
      this.#newPointView.updateElement({
        isSaving: false,
        isDeleting: false,
      });
    });
  }
}
