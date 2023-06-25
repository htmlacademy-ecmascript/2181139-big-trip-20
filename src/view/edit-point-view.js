
import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import he from 'he';
import 'flatpickr/dist/flatpickr.min.css';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { destinations, offersByTypes } from '../models/points-model.js';

dayjs.extend(customParseFormat);

const DATE_FORMAT = 'DD/MM/YY HH:mm';

function editPointTemplate(state) {
  const destination = destinations.find((dest) => dest.id === state.destination);

  const offers = offersByTypes.find((offer) => offer.type === state.type).offers;

  const dateFrom = dayjs(state.dateFrom);
  const dateTo = dayjs(state.dateTo);

  const deleteBtnText = state.isDeleting ? 'Deleting...' : 'Delete';

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${state.type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>

            <div class="event__type-item">
              <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="type" value="taxi" ${state.type === 'taxi' ? 'checked' : ''}>
              <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="type" value="bus" ${state.type === 'bus' ? 'checked' : ''}>
              <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="type" value="train" ${state.type === 'train' ? 'checked' : ''}>
              <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="type" value="ship" ${state.type === 'ship' ? 'checked' : ''}>
              <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="type" value="drive" ${state.type === 'drive' ? 'checked' : ''}>
              <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="type" value="flight" ${state.type === 'flight' ? 'checked' : ''}>
              <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="type" value="check-in" ${state.type === 'check-in' ? 'checked' : ''}>
              <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="type" value="sightseeing" ${state.type === 'sightseeing' ? 'checked' : ''}>
              <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="type" value="restaurant" ${state.type === 'restaurant' ? 'checked' : ''}>
              <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
            </div>
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${state.type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="destinationName" value="${destination ? destination.name : ''}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${destinations.map((dest) => `<option value="${dest.name}"></option>`).join('')}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="dateFrom" value="${dateFrom.format(DATE_FORMAT)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="dateTo" value="${dateTo.format(DATE_FORMAT)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="basePrice" value="${he.encode(`${state.basePrice}`)}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${!destination || state.basePrice === '' || dateFrom > dateTo || state.isSaving || state.isDeleting ? 'disabled' : ''}>${state.isSaving ? 'Saving...' : 'Save'}</button>
      <button class="event__reset-btn" type="reset">${state.id ? deleteBtnText : 'Cancel'}</button>
      ${state.id ? `<button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Close event</span>
      </button>` : ''}
    </header>
    <section class="event__details">
    ${offers.length > 0 ?
    `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        ${offers.map((offer) => createOffer(offer, state)).join('')}
        </div>
      </section>` : ''}

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination ? destination.description : ''}</p>

        ${state.id ? '' : `<div class="event__photos-container">
          <div class="event__photos-tape">
            ${destination ? destination.pictures.map((pic) => `<img class="event__photo" src="${pic.src}" alt="Event photo" title="${pic.description}">`).join('') : ''}
          </div>
        </div>`}
      </section>
    </section>
  </form>
</li>`;
}

function createOffer(offer, state) {
  return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="${offer.id}" ${state.offers.includes(offer.id) ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>
  `;
}

export default class EditPointView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleCloseClick = null;
  #handleDeleteClick = null;
  #dateFromDatepicker = null;
  #dateToDatepicker = null;
  #originalPoint = null;

  constructor({point, onFormSubmit, onDeleteClick, onCloseClick}) {
    super();
    if (point) {
      this.#originalPoint = { ...point };
      this._state = { ...point };
    } else {
      this._state = {
        type: 'taxi',
        destination: null,
        dateFrom: dayjs().toISOString(),
        dateTo: dayjs().toISOString(),
        offers: [],
        basePrice: '',
        isFavorite: false
      };
    }

    this._state.isSaving = false;
    this._state.isDeleting = false;

    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseClick = onCloseClick;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return editPointTemplate(this._state);
  }

  removeElement() {
    super.removeElement();

    if (this.#dateFromDatepicker) {
      this.#dateFromDatepicker.destroy();
      this.#dateFromDatepicker = null;
    }
    if (this.#dateToDatepicker) {
      this.#dateToDatepicker.destroy();
      this.#dateToDatepicker = null;
    }
  }

  #setDatepickers() {
    this.#dateFromDatepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
        maxDate: this._state.dateTo
      },
    );
    this.#dateToDatepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
        minDate: this._state.dateFrom
      },
    );
  }

  _restoreHandlers() {
    const form = this.element.querySelector('form');
    form.addEventListener('change', (evt) => {
      if (evt.target.id === 'event-type-toggle-1') {
        evt.preventDefault();
        return;
      }
      const formData = new FormData(form);
      const destinationName = formData.get('destinationName');

      const type = formData.get('type');
      const basePrice = formData.get('basePrice');
      const offers = offersByTypes.find((offer) => offer.type === type).offers;
      const destination = destinations.find((dest) => dest.name === destinationName);

      this.updateElement({
        ...this._state,
        type,
        destination: destination?.id,
        dateFrom: dayjs(formData.get('dateFrom'), DATE_FORMAT).toISOString(),
        dateTo: dayjs(formData.get('dateTo'), DATE_FORMAT).toISOString(),
        offers: offers.filter((offer) => formData.get(offer.id) !== null).map((offer) => offer.id),
        basePrice: Number(basePrice),
      });
    });

    form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      delete this._state.isDeleting;
      delete this._state.isSaving;
      this.#handleFormSubmit(this._state);
    });

    if (this._state.id) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
        this.updateElement({ ...this.#originalPoint });
        this.#handleCloseClick();
      });
    }

    this.element.querySelector('.event__reset-btn').addEventListener('click', () => {
      this.#handleDeleteClick();
    });

    this.#setDatepickers();
  }

  #dateFromChangeHandler = ([dateFrom]) => {
    this.updateElement({
      dateFrom,
    });
  };

  #dateToChangeHandler = ([dateTo]) => {
    this.updateElement({
      dateTo,
    });
  };
}
