import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';
import {RenderPosition} from '../render.js';
import {render, replace} from '../framework/render.js';

export default class PointsPresenter {
  filtersComponent = new FiltersView();
  sortComponent = new SortView();

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
      render(new PointView({point: this.points[i]}, this.handleOpenFormBtn), this.eventsContainer);
    }
  }

  handleOpenFormBtn = (pointView) => {
    replace(new EditFormView({point: pointView.point}, this.handleSaveForm, this.handleCloseFormBtn), pointView);
  };

  handleCloseFormBtn = (editFormView) => {
    replace(new PointView({point: editFormView.point}, this.handleOpenFormBtn), editFormView);
  };

  handleSaveForm = () => {

  };
}
