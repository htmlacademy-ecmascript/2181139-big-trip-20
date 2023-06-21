import dayjs from 'dayjs';
import dur from 'dayjs/plugin/duration';
import AbstractView from '../framework/view/abstract-view.js';
import { destinations, offersByTypes } from '../models/points-model.js';

dayjs.extend(dur);

const MINUTES_IN_HOUR = 60;

function calcDuration(start, end) {
  const duration = dayjs.duration(end.diff(start));
  if (duration.asHours() < MINUTES_IN_HOUR) {
    return `${duration.format('m')}M`;
  } else if (duration.asDays < 1) {
    return `${duration.format('H')}H ${duration.format('m')}M`;
  } else if (duration.asMonths() < 1) {
    return `${duration.format('D')}D ${duration.format('H')}H ${duration.format('m')}M`;
  } else {
    return `${duration.format('Y')}Y ${duration.format('M')}MO ${duration.format('D')}D ${duration.format('H')}H ${duration.format('m')}M`;
  }
}

function createPointTemplate(point) {
  const offers = offersByTypes.find((offer) => offer.type === point.type).offers;
  const selectedOffers = point.offers.map((selectedOfferId) => offers.find((offer) => offer.id === selectedOfferId));

  const destination = destinations.find((dest) => point.destination === dest.id);

  const start = dayjs(point.dateFrom);
  const end = dayjs(point.dateTo);

  const duration = calcDuration(start, end);

  return `
  <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${point.dateFrom}">${start.format('MMM DD')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${point.type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${point.dateFrom}">${start.format('HH:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${point.dateTo}">${end.format('HH:mm')}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${selectedOffers.map((selectedOffer) =>
    `<li class="event__offer">
          <span class="event__offer-title">${selectedOffer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${selectedOffer.price}</span>
        </li>`
  ).join('')}
      </ul>
      <button class="event__favorite-btn ${point.isFavorite && 'event__favorite-btn--active'}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
}

export default class PointView extends AbstractView {
  #point = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({point, onEditClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;
    this.element.querySelector('button.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
