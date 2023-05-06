import { render, RenderPosition } from './render.js';
import FiltersView from './view/filters-view.js';
import SortView from './view/sort-view.js';
import PointsView from './view/point.js';
import EditFormView from './view/edit-form.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events__list');

render(new FiltersView(), filtersContainer);
render(new SortView(), eventsContainer, RenderPosition.BEFOREBEGIN);
render(new EditFormView(), eventsContainer);
render(new PointsView(), eventsContainer);
render(new PointsView(), eventsContainer);
render(new PointsView(), eventsContainer);

