import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import { render, replace, remove } from '../framework/render';
import { UpdateType, UserAction, Mode } from '../utils/const.js';

export default class PointsPresenter {
  #container = null;
  #point = null;
  #pointView = null;
  #editPointView = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #mode = Mode.DEFAULT;

  constructor({container, onDataChange, onModeChange}) {
    this.#container = container;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointView = this.#pointView;
    const prevEditPointView = this.#editPointView;

    this.#pointView = new PointView({ point: this.#point, onEditClick: this.#handleEditClick, onFavoriteClick: this.#handleFavoriteClick });
    this.#editPointView = new EditPointView({ point: this.#point, onFormSubmit: this.#handleFormSubmit, onDeleteClick: this.#handleDeleteClick, onCloseClick: this.#handleCloseClick});

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

  switchToPointView() {
    replace(this.#pointView, this.#editPointView);
    document.removeEventListener('keyup', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
    this.#handleModeChange(this.#point.id, Mode.DEFAULT);
  }

  switchToEditPointView() {
    replace(this.#editPointView, this.#pointView);
    document.addEventListener('keyup', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;
    this.#handleModeChange(this.#point.id, Mode.EDITING);
  }

  #handleEditClick = () => {
    this.switchToEditPointView();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      { ...this.#point, isFavorite: !this.#point.isFavorite }
    );
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point);
    this.switchToPointView();
  };

  #handleDeleteClick = () => {
    this.switchToPointView();
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      this.#point);
  };

  #handleCloseClick = () => {
    this.switchToPointView();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.switchToPointView();
    }
  };

  destroy() {
    remove(this.#pointView);
    remove(this.#editPointView);
  }

}
