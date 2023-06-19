import {generatePoint} from '../data/mock.js';
import Observable from '../framework/observable.js';

const POINT_COUNT = 3;

export default class PointsModel extends Observable {
  #points = Array.from({length: POINT_COUNT}, generatePoint);

  get points() {
    return this.#points;
  }

  update(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      updatedPoint,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, updatedPoint);
  }

  add(updateType, newPoint) {
    this.#points = [
      newPoint,
      ...this.#points,
    ];

    this._notify(updateType, newPoint);
  }

  remove(updateType, removedPoint) {
    const index = this.#points.findIndex((point) => point.id === removedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t remove unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
