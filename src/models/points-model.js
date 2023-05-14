import {generatePoint} from '../data/mock.js';

const POINT_COUNT = 3;

export default class PointsModel {
  points = Array.from({length: POINT_COUNT}, generatePoint);

  getPoints() {
    return this.points;
  }
}
