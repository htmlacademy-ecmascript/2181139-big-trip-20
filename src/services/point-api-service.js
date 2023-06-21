import ApiService from '../framework/api-service.js';

export default class PointApiService extends ApiService {
  get points() {
    return this._load({url: 'big-trip/points'})
      .then(ApiService.parseResponse)
      .then((points) => points.map(this.transformPointForClient));
  }

  updatePoint(point) {
    return this._load({
      method: 'PUT',
      url: `big-trip/points/${point.id}`,
      body: this.#transformPointForServer(point),
      headers: new Headers({'Content-Type': 'applications/json'})
    })
      .then(ApiService.parseResponse);
  }

  addPoint(point) {
    return this._load({
      method: 'POST',
      url: 'big-trip/points',
      body: this.#transformPointForServer(point),
      headers: new Headers({'Content-Type': 'applications/json'})
    })
      .then(ApiService.parseResponse);
  }

  deletePoint(point){
    return this._load({method: 'DELETE', url: `big-trip/points/${point.id}`});
  }

  get destinations() {
    return this._load({url: 'big-trip/destinations'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'big-trip/offers'})
      .then(ApiService.parseResponse);
  }

  #transformPointForServer(point) {
    const adaptedPoint = {
      ...point,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'base_price': point.basePrice,
      'is_favorite': point.isFavorite,
    };

    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.basePrice;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }

  transformPointForClient(point) {
    const adaptedPoint = {
      ...point,
      dateFrom: point.date_from,
      dateTo: point.date_to,
      basePrice: point.base_price,
      isFavorite: point.is_favorite,
    };

    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.base_price;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;

  }

}
