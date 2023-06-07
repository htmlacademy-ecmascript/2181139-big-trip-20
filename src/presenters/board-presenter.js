import { RenderPosition, render } from '../framework/render.js';
import PointsPresenter from './points-presenter.js';
import { updateItem } from '../utils/common.js';
import SortView from '../view/sort-view.js';

export default class BoardPresenter {
  #eventsContainer = null;

  #sortView = null;

  #pointsModel = null;

  #points = [];
  #pointPresenters = new Map();

  constructor({ eventsContainer, pointsModel }) {
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.getPoints()];
    this.#renderSort();
    this.#renderPoints();
  }

  #renderSort() {
    this.#sortView = new SortView();
    render(this.#sortView, this.#eventsContainer, RenderPosition.BEFOREBEGIN);
  }

  #renderPoints() {
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint(point) {
    const pointPresenter = new PointsPresenter({ container: this.#eventsContainer, onDataChange: this.#handlePointChange });
    pointPresenter.init(point);

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleFavoriteBtn = () => {};

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };
}
