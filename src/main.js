import BoardPresenter from './presenters/board-presenter.js';
import PointsModel from './models/points-model.js';
import FiltersPresenter from './presenters/filters-presenter.js';

const filtersPresenter = new FiltersPresenter({
  filtersContainer: document.querySelector('.trip-controls__filters'),
});
filtersPresenter.init();

const boardPresenter = new BoardPresenter({
  eventsContainer: document.querySelector('.trip-events__list'),
  pointsModel: new PointsModel()
});

boardPresenter.init();
