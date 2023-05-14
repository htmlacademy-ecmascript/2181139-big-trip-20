import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point.js';
import EditFormView from '../view/edit-form.js';
import {RenderPosition, render} from '../render.js';

export default class PointsPresenter {
  filtersComponent = new FiltersView();
  sortComponent = new SortView();
  editFormComponent = new EditFormView();

  constructor({filtersContainer, eventsContainer, pointsModel}) {
    this.filtersContainer = filtersContainer;
    this.eventsContainer = eventsContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.points = [...this.pointsModel.getPoints()];

    render(this.filtersComponent, this.filtersContainer);
    render(this.sortComponent, this.eventsContainer, RenderPosition.BEFOREBEGIN);

    for (let i = 0; i < this.points.length; i++) {
      render(new PointView({point: this.points[i]}), this.eventsContainer);
    }
  }
}
