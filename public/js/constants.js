export const Directions = [
  { dx: 1, dy: 0 },   // E
  { dx: -1, dy: 0 },  // W
  { dx: 0, dy: 1 },   // S
  { dx: 0, dy: -1 },  // N
  { dx: 1, dy: 1 },   // SE
  { dx: -1, dy: -1 }, // NW
  { dx: 1, dy: -1 },  // NE
  { dx: -1, dy: 1 }   // SW
];

export const DifficultyConfig = {
  easy: {
    gridSize: 8,
    wordsMin: 8,
    wordsMax: 10,
    allowDiagonals: false,
    allowBackwardsRatio: 0
  },
  medium: {
    gridSize: 12,
    wordsMin: 12,
    wordsMax: 14,
    allowDiagonals: true,
    allowBackwardsRatio: 0.3
  },
  hard: {
    gridSize: 15,
    wordsMin: 14,
    wordsMax: 16,
    allowDiagonals: true,
    allowBackwardsRatio: 0.5
  }
};

export const BrandLinks = {
  listingsLagos: 'https://igethouse.com',
  nhfInfo: 'https://igethouse.com',
  whatsapp: 'https://wa.me/2348012345678?text=Hi%20IGetHouse%2C%20I%20just%20finished%20the%20word%20puzzle!'
}; 