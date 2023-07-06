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
    this.#mode = Mode.DEFAULT;
    this.#handleModeChange(this.#point.id, Mode.DEFAULT);
  }

  switchToEditPointView() {
    replace(this.#editPointView, this.#pointView);
    this.#mode = Mode.EDITING;
    this.#handleModeChange(this.#point.id, Mode.EDITING);
    document.addEventListener('keyup', this.#handleCloseClick);
  }

  destroy() {
    remove(this.#pointView);
    remove(this.#editPointView);
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editPointView.updateElement({
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editPointView.updateElement({
        isDeleting: true,
      });
    }
  }

  handleError() {
    if (this.#mode === Mode.EDITING) {
      this.#editPointView.shake(() => {
        this.#editPointView.updateElement({
          isSaving: false,
          isDeleting: false,
        });
      });
    } else {
      this.#pointView.shake(() => {});
    }
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

  #handleFormSubmit = async (point) => {
    await this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point);
    this.switchToPointView();
  };

  #handleDeleteClick = async () => {
    await this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      this.#point);
    this.switchToPointView();
  };

  #handleCloseClick = (evt) => {
    if (evt.type === 'keyup' && evt.key !== 'Escape') {
      return;
    }
    document.removeEventListener('keyup', this.#handleCloseClick);
    evt.preventDefault();
    this.#editPointView.updateElement({ ...this.#point });
    this.switchToPointView();
  };
}
