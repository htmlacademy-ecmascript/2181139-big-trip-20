import BoardPresenter from './presenters/board-presenter.js';
import PointsModel from './models/points-model.js';
import FiltersPresenter from './presenters/filters-presenter.js';
import FiltersModel from './models/filters-model.js';
import { render } from './framework/render.js';
import NewPointButtonView from './view/new-point-button-view.js';

const filtersModel = new FiltersModel();
const pointsModel = new PointsModel();

const filtersPresenter = new FiltersPresenter({
  filtersContainer: document.querySelector('.trip-controls__filters'),
  filtersModel,
  pointsModel
});

const boardPresenter = new BoardPresenter({
  eventsContainer: document.querySelector('.trip-events__list'),
  filtersModel,
  pointsModel,
  onNewPointDestroy: handleNewPointFormClose
});

const newPointButtonView = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonView.element.disabled = false;
}

function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newPointButtonView.element.disabled = true;
}

render(newPointButtonView, document.querySelector('.trip-main'));

filtersPresenter.init();
boardPresenter.init();
