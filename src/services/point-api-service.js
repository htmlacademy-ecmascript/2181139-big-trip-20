import ApiService from '../framework/api-service.js';
import he from 'he';

export default class PointApiService extends ApiService {
  get points() {
    return this._load({url: 'big-trip/points'})
      .then(ApiService.parseResponse)
      .then((points) => points.map(this.transformPointForClient));
  }

  get destinations() {
    return this._load({url: 'big-trip/destinations'})
      .then(ApiService.parseResponse).then((destinations) =>
        destinations.map((d) =>
          ({
            id: he.encode(d.id),
            name: he.encode(d.name),
            description: he.encode(d.description),
            pictures: d.pictures?.map((p) => ({
              src: he.encode(p.src),
              description: he.encode(p.description)
            }))
          })));
  }

  get offers() {
    return this._load({url: 'big-trip/offers'})
      .then(ApiService.parseResponse).then((offers) => offers?.map((o) => ({
        type: he.encode(o.type),
        offers: o.offers?.map((el) => ({
          id: he.encode(el.id),
          title: he.encode(el.title),
          price: he.encode(el.price.toString())
        }))
      })));
  }

  updatePoint(point) {
    return this._load({method: 'PUT', url: `big-trip/points/${point.id}`, body: this.#transformPointForServer(point), headers: new Headers({ 'Content-Type': 'application/json'})})
      .then(ApiService.parseResponse);
  }

  addPoint(point) {
    return this._load({method: 'POST', url: 'big-trip/points', body: this.#transformPointForServer(point), headers: new Headers({ 'Content-Type': 'application/json'})})
      .then(ApiService.parseResponse);
  }

  deletePoint(point){
    return this._load({method: 'DELETE', url: `big-trip/points/${point.id}`});
  }

  #transformPointForServer(point) {
    const adaptedPoint = {
      ...point,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'base_price': Number(point.basePrice),
      'is_favorite': point.isFavorite === true,
    };

    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.basePrice;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }

  transformPointForClient(point) {
    const adaptedPoint = {
      id: he.encode(point.id),
      type: he.encode(point.type),
      destination: he.encode(point.destination),
      dateFrom: he.encode(point.date_from),
      dateTo: he.encode(point.date_to),
      basePrice: he.encode(point.base_price.toString()),
      isFavorite: point.is_favorite === true,
      offers: point.offers?.map((o) => he.encode(o))
    };

    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.base_price;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;
  }
}
