import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import { render, replace, remove } from '../framework/render';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointsPresenter {
  #container = null;
  #point = null;
  #pointView = null;
  #editPointView = null;
  #handleDataChange = null;

  #mode = Mode.DEFAULT;

  constructor({container, onDataChange}) {
    this.#container = container;
    this.#handleDataChange = onDataChange;
  }

  init(point) {
    this.#point = point;

    const prevPointView = this.#pointView;
    const prevEditPointView = this.#editPointView;

    this.#pointView = new PointView({ point: this.#point, onEditClick: this.#handleEditClick, onFavoriteClick: this.#handleFavoriteClick });
    this.#editPointView = new EditPointView({ point: this.#point, onFormSubmit: this.#handleFormSubmit, onCloseClick: this.#handleCloseClick});

    if (prevPointView === null || prevEditPointView === null) {
      render(this.#pointView, this.#container);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointView, prevPointView);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointView, prevEditPointView);
    }

    remove(prevPointView);
    remove(prevEditPointView);
  }

  #switchToPointView() {
    replace(this.#pointView, this.#editPointView);
    document.removeEventListener('keyup', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #switchToEditPointView() {
    replace(this.#editPointView, this.#pointView);
    document.addEventListener('keyup', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;
  }

  #handleEditClick = () => {
    this.#switchToEditPointView();
  };

  #handleCloseClick = () => {
    this.#switchToPointView();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({ ...this.#point, isFavorite: !this.#point.isFavorite });
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(point);
    this.#switchToPointView();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#switchToPointView();
    }
  };
}
