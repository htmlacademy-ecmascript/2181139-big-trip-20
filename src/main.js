import PointsPresenter from './presenters/points-presenter.js';
import PointsModel from './models/points-model.js';

const pointsPresenter = new PointsPresenter({
  filtersContainer: document.querySelector('.trip-controls__filters'),
  eventsContainer: document.querySelector('.trip-events__list'),
  pointsModel: new PointsModel()
});

pointsPresenter.init();
