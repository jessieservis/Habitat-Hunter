// Mock API service for animal guessing game
// Replace with actual FastAPI endpoints when backend is ready

const MOCK_ANIMALS = [
  {
    name: 'Bengal Tiger',
    location: 'India',
    acceptedAnswers: ['india', 'bangladesh'],
    conservationStatus: 'Endangered',
    population: '~2,500 in the wild',
    threats: 'Habitat loss, poaching, human-wildlife conflict',
    clues: [
      'I am one of the largest cats in the world',
      'I have distinctive orange fur with black stripes',
      'I am an excellent swimmer and love water',
      'I am native to the Indian subcontinent',
      'I am a solitary hunter and apex predator'
    ],
    mapImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFhNGQyZSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW5kaWEgJmFtcDsgQmFuZ2xhZGVzaDwvdGV4dD48L3N2Zz4='
  },
  {
    name: 'Scarlet Macaw',
    location: 'Brazil',
    acceptedAnswers: ['brazil', 'peru', 'colombia', 'mexico', 'costa rica'],
    conservationStatus: 'Least Concern',
    population: '~20,000-50,000 in the wild',
    threats: 'Deforestation, illegal pet trade',
    clues: [
      'I am one of the most colorful birds in the world',
      'My feathers are bright red, yellow, and blue',
      'I can live up to 50 years in the wild',
      'I am native to Central and South American rainforests',
      'I mate for life with my partner'
    ],
    mapImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFhNGQyZSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q2VudHJhbCAmYW1wOyBTb3V0aCBBbWVyaWNhPC90ZXh0Pjwvc3ZnPg=='
  },
  {
    name: 'African Elephant',
    location: 'Kenya',
    acceptedAnswers: ['kenya', 'tanzania', 'botswana', 'zimbabwe', 'south africa', 'namibia'],
    conservationStatus: 'Endangered',
    population: '~415,000 in the wild',
    threats: 'Poaching for ivory, habitat fragmentation',
    clues: [
      'I am the largest land animal on Earth',
      'I have a long trunk with over 40,000 muscles',
      'I use my large ears to regulate body temperature',
      'I live in herds led by the oldest female',
      'I can communicate through infrasonic sounds'
    ],
    mapImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFhNGQyZSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U3ViLVNhaGFyYW4gQWZyaWNhPC90ZXh0Pjwvc3ZnPg=='
  }
];

let currentAnimalIndex = 0;
let currentClueIndex = 0;

export async function startNewRound() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  currentAnimalIndex = Math.floor(Math.random() * MOCK_ANIMALS.length);
  currentClueIndex = 0;

  return {
    success: true,
    clue: MOCK_ANIMALS[currentAnimalIndex].clues[currentClueIndex],
    clueNumber: currentClueIndex + 1,
    totalClues: MOCK_ANIMALS[currentAnimalIndex].clues.length
  };
}

export async function getNextClue() {
  await new Promise(resolve => setTimeout(resolve, 300));

  currentClueIndex++;
  const animal = MOCK_ANIMALS[currentAnimalIndex];

  if (currentClueIndex >= animal.clues.length) {
    return {
      success: false,
      message: 'No more clues available'
    };
  }

  return {
    success: true,
    clue: animal.clues[currentClueIndex],
    clueNumber: currentClueIndex + 1,
    totalClues: animal.clues.length
  };
}

export async function submitGuess(guess) {
  await new Promise(resolve => setTimeout(resolve, 500));

  const animal = MOCK_ANIMALS[currentAnimalIndex];
  const normalizedGuess = guess.toLowerCase().trim();
  const isCorrect = animal.acceptedAnswers.includes(normalizedGuess);

  return {
    success: true,
    correct: isCorrect,
    speciesName: animal.name,
    location: animal.location,
    conservationStatus: animal.conservationStatus,
    population: animal.population,
    threats: animal.threats,
    mapImage: animal.mapImage,
    cluesUsed: currentClueIndex + 1,
    score: isCorrect ? Math.max(100 - (currentClueIndex * 15), 10) : 0
  };
}
