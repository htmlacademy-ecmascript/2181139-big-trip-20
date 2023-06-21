import BoardPresenter from './presenters/board-presenter.js';
import { PointsModel } from './models/points-model.js';
import FiltersPresenter from './presenters/filters-presenter.js';
import FiltersModel from './models/filters-model.js';
import { render } from './framework/render.js';
import NewPointButtonView from './view/new-point-button-view.js';
import PointApiService from './services/point-api-service.js';

const endPoint = 'https://20.ecmascript.pages.academy';
const authorization = 'Basic eo0w590ik29999a';
const pointApiService = new PointApiService(endPoint, authorization);

const filtersModel = new FiltersModel();
const pointsModel = new PointsModel(pointApiService);

const newPointButtonView = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

pointsModel.init()
  .finally(() => {
    render(newPointButtonView, document.querySelector('.trip-main'));
  });

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

function handleNewPointFormClose() {
  newPointButtonView.element.disabled = false;
}

function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newPointButtonView.element.disabled = true;
}

filtersPresenter.init();

