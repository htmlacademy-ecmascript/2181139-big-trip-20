import { offersByTypes, destinations } from './static-data.js';
import { nanoid } from 'nanoid';

function generatePoint() {
  const types = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
  const startDates = ['2024-07-22T05:28:01.397Z', '2024-07-24T04:28:01.397Z', '2024-07-25T05:28:01.397Z', '2024-07-26T10:28:01.397Z'];
  const endDates = ['2024-07-24T04:28:01.397Z', '2024-07-25T05:28:01.397Z', '2024-07-26T10:28:01.397Z', '2024-07-27T06:28:01.397Z'];
  const prices = ['1500', '1800', '2000', '2500'];
  const favourites = [true, false];

  const type = getRandomArrayElement(types);
  const offerIds = offersByTypes.find((offer) => offer.type === type).offers.map((offer) => offer.id);

  return {
    id: nanoid(),
    type,
    destination: getRandomArrayElement(destinations.map((dest) => dest.id)),
    dateFrom: getRandomArrayElement(startDates),
    dateTo: getRandomArrayElement(endDates),
    offers: [getRandomArrayElement(offerIds)],
    basePrice: getRandomArrayElement(prices),
    isFavorite: getRandomArrayElement(favourites)
  };
}

function getRandomArrayElement(a) {
  return a[Math.round(Math.random() * (a.length - 1))];
}

export { generatePoint, getRandomArrayElement };
