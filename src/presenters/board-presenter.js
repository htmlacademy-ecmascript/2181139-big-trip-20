import { RenderPosition, render, remove } from '../framework/render.js';
import PointsPresenter from './points-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import SortView from '../view/sort-view.js';
import {FilterType, Mode, SortType, UpdateType} from '../utils/const.js';
import { filter } from '../utils/filter.js';
import NoPointsView from '../view/no-points-view.js';
import { UserAction } from '../utils/const.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import ErrorView from '../view/error-view.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class BoardPresenter {
  #eventsContainer = null;

  #pointsModel = null;
  #filtersModel = null;

  #pointPresenters = new Map();
  #newPointPresenter = null;

  #filterType = FilterType.EVERYTHING;
  #sortType = SortType.DAY;

  #pointIdInEditMode = null;
  #pointCreationInProgress = false;

  #sortView = null;
  #noPointsView = null;
  #loadingView = new LoadingView();

  #errorView = new ErrorView();

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ eventsContainer, filtersModel, pointsModel, onNewPointDestroy }) {
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;

    this.#newPointPresenter = new NewPointPresenter({

      container: this.#eventsContainer,
      onDataChange: this.#handleViewAction,
      onDestroy: () => {
        this.#pointCreationInProgress = false;
        onNewPointDestroy();
      }
    });

    this.#pointsModel.addObserver(this.#handlePointsModelEvent);
    this.#filtersModel.addObserver(this.#handleFiltersModelEvent);
    this.#renderLoading();
  }

  get points() {
    this.#filterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#sortType) {
      case SortType.DAY:
        return filteredPoints.sort((a, b) => Date.parse(a.dateFrom) - Date.parse(b.dateFrom));
      case SortType.TIME:
        return filteredPoints.sort((a, b) => {
          const duration1 = Date.parse(a.dateTo) - Date.parse(a.dateFrom);
          const duration2 = Date.parse(b.dateTo) - Date.parse(b.dateFrom);
          return duration2 - duration1;
        });
      case SortType.PRICE:
        return filteredPoints.sort((a, b) => b.basePrice - a.basePrice);
    }

    return filteredPoints;
  }

  createPoint() {
    if (this.#pointIdInEditMode !== null) {
      this.#pointPresenters.get(this.#pointIdInEditMode).switchToPointView();
      this.#pointIdInEditMode = null;
    }
    this.#pointCreationInProgress = true;

    this.#sortType = SortType.DAY;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #renderBoard() {
    this.#renderSort();
    this.#renderPoints();
  }

  #renderSort() {
    this.#sortView = new SortView({ currentSortType: this.#sortType, onSortTypeChange: this.#handleSortTypeChange});
    render(this.#sortView, this.#eventsContainer, RenderPosition.BEFOREBEGIN);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#sortType === sortType) {
      return;
    }

    this.#sortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderPoints() {
    const points = this.points;

    if (points.length === 0) {
      this.#noPointsView = new NoPointsView({filterType: this.#filterType});
      render(this.#noPointsView, this.#eventsContainer);
      return;
    }

    points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint(point) {
    const pointPresenter = new PointsPresenter({ container: this.#eventsContainer, onDataChange: this.#handleViewAction, onModeChange: this.#handlePointViewModeChange });
    pointPresenter.init(point);

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderLoading() {
    render(this.#loadingView, this.#eventsContainer, RenderPosition.AFTERBEGIN);
  }

  #handleViewAction = async (userAction, updateType, updatedPoint) => {
    this.#uiBlocker.block();

    try {
      switch (userAction) {
        case UserAction.UPDATE_POINT:
          this.#pointPresenters.get(updatedPoint.id).setSaving();
          await this.#pointsModel.update(updateType, updatedPoint);
          break;
        case UserAction.ADD_POINT:
          this.#newPointPresenter.setSaving();
          await this.#pointsModel.add(updateType, updatedPoint);
          break;
        case UserAction.DELETE_POINT:
          this.#pointPresenters.get(updatedPoint.id).setDeleting();
          await this.#pointsModel.remove(updateType, updatedPoint);
          break;
      }
    } catch (err) {
      if (userAction === UserAction.ADD_POINT) {
        this.#newPointPresenter.handleError();
      } else {
        this.#pointPresenters.get(updatedPoint.id).handleError();
      }
      throw err;
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #handlePointsModelEvent = (updateType, point) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(point.id).init(point);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSorting: true, resetFilter: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        remove(this.#loadingView);
        if (this.#pointsModel.points.length === 0) {
          render(this.#errorView, this.#eventsContainer, RenderPosition.AFTERBEGIN);
        } else {
          this.#renderBoard();
        }
        break;
    }
  };

  #handleFiltersModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.PATCH:
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSorting: true });
        this.#renderBoard();
        break;
    }
  };

  #clearBoard({resetSorting = false, resetFilter = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    if (this.#noPointsView !== null) {
      remove(this.#noPointsView);
      this.#noPointsView = null;
    }

    remove(this.#sortView);
    this.#sortView = null;

    if (resetFilter) {
      this.#filterType = FilterType.EVERYTHING;
    }

    if (resetSorting) {
      this.#sortType = SortType.DAY;
    }
  }

  #handlePointViewModeChange = (pointId, mode) => {
    if (mode === Mode.DEFAULT) {
      this.#pointIdInEditMode = null;
      return;
    }

    if (this.#pointCreationInProgress) {
      this.#newPointPresenter.destroy();
    }

    if (this.#pointIdInEditMode !== null) {
      this.#pointPresenters.get(this.#pointIdInEditMode).switchToPointView();
    }

    this.#pointIdInEditMode = pointId;
  };
}
