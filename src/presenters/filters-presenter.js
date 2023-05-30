import { remove, render, replace } from '../framework/render';
import FiltersView from '../view/filters-view';

export default class FiltersPresenter {
  #container = null;
  #filtersView = null;

  constructor({ filtersContainer }) {
    this.#container = filtersContainer;
  }

  init() {
    const prevFiltersView = this.#filtersView;
    this.#filtersView = new FiltersView();

    if (prevFiltersView === null) {
      render(this.#filtersView, this.#container);
      return;
    }

    replace(this.#filtersView, prevFiltersView);
    remove(prevFiltersView);
  }
}
