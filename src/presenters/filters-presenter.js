import { remove, render, replace } from '../framework/render';
import FiltersView from '../view/filters-view';
import { FilterType, UpdateType } from '../utils/const.js';
import { filter } from '../utils/filter.js';


export default class FiltersPresenter {
  #container = null;
  #filtersView = null;
  #filtersModel = null;
  #pointsModel = null;

  constructor({ filtersContainer, filtersModel, pointsModel }) {
    this.#container = filtersContainer;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return Object.values(FilterType).map((type) => ({
      type,
      count: filter[type](points).length
    }));
  }

  init() {
    if (this.#pointsModel.points.length === 0) {
      return;
    }

    const filters = this.filters;
    const prevFiltersView = this.#filtersView;
    this.#filtersView = new FiltersView({
      filters,
      currentFilterType: this.#filtersModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFiltersView === null) {
      render(this.#filtersView, this.#container);
      return;
    }

    replace(this.#filtersView, prevFiltersView);
    remove(prevFiltersView);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }

    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
