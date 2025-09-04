import { DifficultyConfig } from './constants.js';
import { normalizeWord, createRng, shuffleInPlace, pickRandom, timeToMMSS, sha256Hex, hexToUint32, liveAnnounce, todayYYYYMMDD } from './utils.js';
import Words from '../data/words.js';
// Removed import of showGame to avoid circular dependency

let current = null; // holds current game state

const elements = {
  grid: () => document.getElementById('grid'),
  wordList: () => document.getElementById('word-list'),
  progressCount: () => document.getElementById('progress-count'),
  progressTotal: () => document.getElementById('progress-total'),
  timer: () => document.getElementById('timer'),
  score: () => document.getElementById('score'),
  hintBtn: () => document.getElementById('btn-hint'),
  restartBtn: () => document.getElementById('btn-restart'),
  resultsModal: () => document.getElementById('results-modal'),
  finalTime: () => document.getElementById('final-time'),
  finalScore: () => document.getElementById('final-score'),
  finalStreak: () => document.getElementById('final-streak')
};

const loadWords = async () => {
  return Words;
};

const sampleWordsForDifficulty = (allWords, difficultyKey, rand) => {
  const cfg = DifficultyConfig[difficultyKey];
  const count = cfg.wordsMin + Math.floor(rand() * (cfg.wordsMax - cfg.wordsMin + 1));
  const pool = [...allWords];
  shuffleInPlace(pool, rand);
  return pool.slice(0, count);
};

const getAllowedDirections = (difficultyKey) => {
  if (difficultyKey === 'easy') return [ {dx:1,dy:0}, {dx:0,dy:1} ];
  if (difficultyKey === 'medium') return [ {dx:1,dy:0}, {dx:-1,dy:0}, {dx:0,dy:1}, {dx:0,dy:-1}, {dx:1,dy:1}, {dx:1,dy:-1} ];
  return [ {dx:1,dy:0}, {dx:-1,dy:0}, {dx:0,dy:1}, {dx:0,dy:-1}, {dx:1,dy:1}, {dx:-1,dy:-1}, {dx:1,dy:-1}, {dx:-1,dy:1} ];
};

const tryPlaceWord = (grid, word, rand, cfg, allowedDirs) => {
  const size = grid.length;
  const letters = word.split('');
  const maxAttempts = 200;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const backwards = rand() < cfg.allowBackwardsRatio;
    const useLetters = backwards ? [...letters].reverse() : letters;
    const dir = pickRandom(allowedDirs, rand);
    const startX = Math.floor(rand() * size);
    const startY = Math.floor(rand() * size);

    const endX = startX + dir.dx * (useLetters.length - 1);
    const endY = startY + dir.dy * (useLetters.length - 1);
    if (endX < 0 || endX >= size || endY < 0 || endY >= size) continue;

    let fits = true;
    for (let i = 0; i < useLetters.length; i++) {
      const x = startX + dir.dx * i;
      const y = startY + dir.dy * i;
      const cell = grid[y][x];
      if (cell.letter && cell.letter !== useLetters[i]) {
        fits = false; break;
      }
    }
    if (!fits) continue;

    for (let i = 0; i < useLetters.length; i++) {
      const x = startX + dir.dx * i;
      const y = startY + dir.dy * i;
      grid[y][x].letter = useLetters[i];
      grid[y][x].wordIds.push(word);
    }
    return { placed: true, positions: Array.from({length: useLetters.length}, (_, i) => ({ x: startX + dir.dx * i, y: startY + dir.dy * i })) };
  }
  return { placed: false };
};

const fillRandomLetters = (grid, rand) => {
  const alphabet = 'EEEEEEEEEEEEEEEEEEEEETAOINSRHLDCUMFPGWYBVKXJQZ'; // weighted
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid.length; x++) {
      if (!grid[y][x].letter) {
        grid[y][x].letter = alphabet[Math.floor(rand() * alphabet.length)];
      }
    }
  }
};

const buildPuzzle = (wordsRaw, difficultyKey, rand) => {
  const cfg = DifficultyConfig[difficultyKey];
  const size = cfg.gridSize;
  const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => ({ letter: '', wordIds: [], locked: false })));
  const allowedDirs = getAllowedDirections(difficultyKey);
  const words = wordsRaw.map(normalizeWord).sort((a,b) => b.length - a.length);

  const wordPlacements = new Map();

  for (const w of words) {
    const result = tryPlaceWord(grid, w, rand, cfg, allowedDirs);
    if (!result.placed) {
      continue;
    }
    wordPlacements.set(w, result.positions);
  }

  fillRandomLetters(grid, rand);
  return { grid, wordPlacements };
};

const renderPuzzle = (puzzle) => {
  const gridEl = elements.grid();
  const size = puzzle.grid.length;
  gridEl.style.display = 'grid';
  gridEl.style.gridTemplateColumns = `repeat(${size}, minmax(0,1fr))`;
  gridEl.style.gap = '4px';
  gridEl.innerHTML = '';

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const btn = document.createElement('button');
      btn.className = 'aspect-square rounded-lg border border-gray-200 bg-white text-sm font-semibold select-none focus-ring';
      btn.dataset.x = String(x);
      btn.dataset.y = String(y);
      btn.textContent = puzzle.grid[y][x].letter;
      gridEl.appendChild(btn);
    }
  }
};

const renderWordList = (words, foundSet) => {
  const list = elements.wordList();
  list.innerHTML = '';
  for (const w of words) {
    const li = document.createElement('li');
    const normalized = normalizeWord(w);
    li.textContent = w;
    li.className = 'px-2 py-1 rounded-lg border border-gray-200 bg-white';
    if (foundSet.has(normalized)) {
      li.classList.add('line-through', 'opacity-60');
    }
    list.appendChild(li);
  }
};

const attachSelectionHandlers = (state) => {
  const gridEl = elements.grid();
  let selecting = false;
  let start = null;
  let hoveredCells = [];

  const clearHover = () => {
    for (const el of hoveredCells) el.classList.remove('bg-brand-mint');
    hoveredCells = [];
  };

  const getCell = (x, y) => gridEl.querySelector(`button[data-x="${x}"][data-y="${y}"]`);

  const normalizeDir = (dx, dy) => {
    if (dx === 0 && dy === 0) return { dx: 0, dy: 0 };
    const ndx = dx === 0 ? 0 : dx > 0 ? 1 : -1;
    const ndy = dy === 0 ? 0 : dy > 0 ? 1 : -1;
    return { dx: ndx, dy: ndy };
  };

  const computePath = (sx, sy, ex, ey) => {
    const dir = normalizeDir(ex - sx, ey - sy);
    if (dir.dx === 0 && dir.dy === 0) return [];
    const path = [];
    let x = sx, y = sy;
    while (x !== ex || y !== ey) {
      x += dir.dx; y += dir.dy;
      path.push({ x, y });
      if (path.length > 50) break; // safety
    }
    return [{ x: sx, y: sy }, ...path];
  };

  const onDown = (e) => {
    const target = e.target.closest('button[data-x]');
    if (!target) return;
    selecting = true;
    start = { x: Number(target.dataset.x), y: Number(target.dataset.y) };
    clearHover();
    target.classList.add('bg-brand-mint');
    hoveredCells.push(target);
  };

  const onMove = (e) => {
    if (!selecting || !start) return;
    const target = e.target.closest('button[data-x]');
    if (!target) return;
    const end = { x: Number(target.dataset.x), y: Number(target.dataset.y) };
    clearHover();
    const path = computePath(start.x, start.y, end.x, end.y);
    for (const p of path) {
      const cell = getCell(p.x, p.y);
      if (cell) {
        cell.classList.add('bg-brand-mint');
        hoveredCells.push(cell);
      }
    }
  };

  const onUp = () => {
    if (!selecting || !start) return;
    selecting = false;
    const letters = hoveredCells.map((el) => el.textContent).join('');
    const reversed = letters.split('').reverse().join('');

    // check match
    let matchedKey = null;
    for (const key of Object.keys(state.wordPlacements)) {
      const word = key;
      if (word === letters || word === reversed) {
        matchedKey = word; break;
      }
    }

    if (matchedKey && !state.found.has(matchedKey)) {
      state.found.add(matchedKey);
      for (const el of hoveredCells) el.classList.add('bg-brand', 'text-white');
      elements.progressCount().textContent = String(state.found.size);
      liveAnnounce('Word found');
      updateScoreOnWord(state);
      renderWordList(state.originalWords, state.foundView);
      checkCompletion(state);
    }

    clearHover();
    start = null;
  };

  gridEl.addEventListener('mousedown', onDown);
  gridEl.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);

  gridEl.addEventListener('touchstart', (e) => { e.preventDefault(); onDown(e.touches[0]); }, { passive: false });
  gridEl.addEventListener('touchmove', (e) => { e.preventDefault(); onMove(e.touches[0]); }, { passive: false });
  gridEl.addEventListener('touchend', (e) => { e.preventDefault(); onUp(); }, { passive: false });
};

const startTimer = (state) => {
  state.timerStart = performance.now();
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    const secs = Math.floor((performance.now() - state.timerStart) / 1000);
    elements.timer().textContent = timeToMMSS(secs);
  }, 250);
};

const stopTimer = (state) => {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = null;
  const secs = Math.floor((performance.now() - state.timerStart) / 1000);
  return secs;
};

const updateScoreOnWord = (state) => {
  const diffMult = state.difficulty === 'easy' ? 1.0 : state.difficulty === 'medium' ? 1.3 : 1.6;
  const now = performance.now();
  const secondsSinceLast = state.lastWordAt ? (now - state.lastWordAt) / 1000 : 999;
  state.lastWordAt = now;

  let delta = Math.floor(100 * diffMult);
  const timeBonus = Math.max(0, 50 - Math.floor(secondsSinceLast));
  delta += timeBonus;
  if (secondsSinceLast < 15000) state.combo += 10; else state.combo = 0;
  delta += state.combo;
  state.score += delta;
  elements.score().textContent = String(state.score);
};

const checkCompletion = (state) => {
  if (state.found.size >= state.targetWordCount) {
    const secs = stopTimer(state);
    let final = state.score;
    if (!state.timerEnabled) final = Math.floor(final * 0.9);
    final = Math.floor(final * (1 - 0.15 * state.hintsUsed));
    elements.finalTime().textContent = timeToMMSS(secs);
    elements.finalScore().textContent = String(final);

    // streak (daily only): simplistic local streak counter
    let streak = Number(localStorage.getItem('igh_streak') || '0');
    const last = localStorage.getItem('igh_streak_last');
    const today = todayYYYYMMDD();
    if (state.isDaily) {
      if (last && last !== today) streak += 1;
      if (!last) streak = 1;
      localStorage.setItem('igh_streak', String(streak));
      localStorage.setItem('igh_streak_last', today);
    }
    elements.finalStreak().textContent = String(streak || 0);

    elements.resultsModal().showModal();
  }
};

const wireHintAndRestart = (state) => {
  elements.hintBtn().addEventListener('click', () => {
    const remaining = state.originalWords
      .map(normalizeWord)
      .filter((w) => !state.found.has(w));
    if (remaining.length === 0) return;
    const target = remaining[Math.floor(state.rand() * remaining.length)];
    state.hintsUsed += 1;
    // pulse first letter
    const pos = state.wordPlacements[target][0];
    const cell = elements.grid().querySelector(`button[data-x="${pos.x}"][data-y="${pos.y}"]`);
    if (cell) {
      cell.classList.add('animate-pulse', 'ring-2', 'ring-brand');
      setTimeout(() => cell.classList.remove('animate-pulse', 'ring-2', 'ring-brand'), 1500);
    }
  });

  elements.restartBtn().addEventListener('click', () => {
    if (current?.restart) current.restart();
  });
};

const generateSeedFromDateAndCategory = async (dateStr, categoryKey) => {
  const hex = await sha256Hex(`IGETHOUSE-${dateStr}-${categoryKey.toUpperCase()}`);
  return hexToUint32(hex);
};

export const startQuickPlay = async (categoryKey, userSettings) => {
  const wordsBank = await loadWords();
  const allWords = wordsBank[categoryKey] || wordsBank['propertyTypes'] || [];
  const seed = ((Date.now() & 0xffffffff) ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
  const rand = createRng(seed);
  const picked = sampleWordsForDifficulty(allWords, userSettings.difficulty, rand);
  const puzzle = buildPuzzle(picked, userSettings.difficulty, rand);

  current = createRuntimeState({
    categoryKey,
    difficulty: userSettings.difficulty,
    timerEnabled: userSettings.timerEnabled,
    rand,
    originalWords: picked,
    puzzle,
    isDaily: false
  });

  renderGame(current);
};

export const startDailyChallengeFromHome = async (userSettings) => {
  const wordsBank = await loadWords();
  let categories = Object.keys(wordsBank || {});
  if (!categories || categories.length === 0) {
    categories = ['propertyTypes'];
  }
  const today = todayYYYYMMDD();
  // deterministic category selection
  let categoryKey = 'propertyTypes';
  try {
    const seedForCategory = await generateSeedFromDateAndCategory(today, 'CATEGORY');
    const randForCategory = createRng(seedForCategory);
    categoryKey = categories[Math.floor(randForCategory() * categories.length)] || 'propertyTypes';
  } catch {
    categoryKey = 'propertyTypes';
  }

  let seed = 1;
  try {
    seed = await generateSeedFromDateAndCategory(today, categoryKey);
  } catch {
    seed = ((Date.now() & 0xffffffff) ^ 0x9e3779b9) >>> 0;
  }
  const rand = createRng(seed);
  const picked = sampleWordsForDifficulty(wordsBank[categoryKey] || wordsBank['propertyTypes'] || [], userSettings.difficulty, rand);
  const puzzle = buildPuzzle(picked, userSettings.difficulty, rand);

  current = createRuntimeState({
    categoryKey,
    difficulty: userSettings.difficulty,
    timerEnabled: userSettings.timerEnabled,
    rand,
    originalWords: picked,
    puzzle,
    isDaily: true
  });

  renderGame(current);
};

const createRuntimeState = ({ categoryKey, difficulty, timerEnabled, rand, originalWords, puzzle, isDaily }) => {
  const found = new Set();
  const foundView = new Set();
  const wordPlacements = {};
  for (const [w, pos] of puzzle.wordPlacements.entries()) wordPlacements[w] = pos;
  return {
    categoryKey,
    difficulty,
    timerEnabled,
    rand,
    originalWords,
    puzzle,
    wordPlacements,
    targetWordCount: originalWords.length,
    found,
    foundView,
    timerStart: 0,
    timerInterval: null,
    lastWordAt: 0,
    score: 0,
    combo: 0,
    hintsUsed: 0,
    restart: () => {
      renderGame(current);
    }
  };
};

const renderGame = (state) => {
  renderPuzzle(state.puzzle);
  renderWordList(state.originalWords, state.foundView);
  elements.progressCount().textContent = '0';
  elements.progressTotal().textContent = String(state.targetWordCount);
  elements.score().textContent = '0';
  elements.timer().textContent = '00:00';
  if (state.timerEnabled) startTimer(state);
  attachSelectionHandlers({ ...state, foundView: state.found });
  wireHintAndRestart(state);
}; 