import { FilterType } from './const.js';

function isFuturePoint(dateFrom) {
  return new Date() < new Date(Date.parse(dateFrom));
}

function isPresentPoint(dateFrom, dateTo) {
  const currentDate = new Date();
  return currentDate >= new Date(Date.parse(dateFrom)) && currentDate <= new Date(Date.parse(dateTo));
}

function isPastPoint(dateTo) {
  return new Date() > new Date(Date.parse(dateTo));
}

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePoint(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPresentPoint(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastPoint(point.dateTo)),
};

export { filter };
