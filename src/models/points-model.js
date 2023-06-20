
import Observable from '../framework/observable.js';

export let offersByTypes = [];
export let destinations = [];

export class PointsModel extends Observable {
  #points = [];
  #pointApiService = null;

  constructor(pointApiService){
    super();
    this.#pointApiService = pointApiService;
    this.destinations = [];
    this.offersByTypes = [];
  }

  async init() {
    try {
      this.#points = await this.#pointApiService.points;
      destinations = await this.#pointApiService.destinations;
      offersByTypes = await this.#pointApiService.offers;
    } catch (err) {
      this.#points = [];
    }
    this._notify('INIT');
  }

  get points() {
    return this.#points;
  }

  async update(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointApiService.updatePoint(updatedPoint);
      const point = this.#pointApiService.transformPointForClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        point,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch (err) {
      throw new Error('Can\'t update point');
    }
  }

  async add(updateType, newPoint) {

    try {
      const response = await this.#pointApiService.addPoint(newPoint);
      const point = this.#pointApiService.transformPointForClient(response);

      this.#points = [
        point,
        ...this.#points,
      ];
      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t create point');
    }
  }

  async remove(updateType, removedPoint) {
    const index = this.#points.findIndex((point) => point.id === removedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t remove unexisting point');
    }

    try {
      await this.#pointApiService.deletePoint(removedPoint);

      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete point');
    }
  }
}
