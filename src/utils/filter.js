import { FilterType } from './const.js';

function isFuturePoint(dateFrom) {
  return Date.now() < Date.parse(dateFrom);
}

function isPresentPoint(dateFrom, dateTo) {
  const currentDate = Date.now();
  return currentDate >= Date.parse(dateFrom) && currentDate <= Date.parse(dateTo);
}

function isPastPoint(dateTo) {
  return Date.now() > Date.parse(dateTo);
}

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePoint(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPresentPoint(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastPoint(point.dateTo)),
};

export { filter };
