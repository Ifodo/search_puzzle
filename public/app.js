import { loadCategories } from './js/ui.js';
import { startQuickPlay, startDailyChallengeFromHome } from './js/game.js';

const homeView = document.getElementById('view-home');
const gameView = document.getElementById('view-game');

const btnHome = document.getElementById('btn-home');
const btnSettings = document.getElementById('btn-settings');
const settingsDialog = document.getElementById('settings-dialog');
const btnDaily = document.getElementById('btn-daily');

const difficultySelect = document.getElementById('difficulty');
const timerEnabledCheckbox = document.getElementById('timer-enabled');
const soundEnabledCheckbox = document.getElementById('sound-enabled');

const state = {
  difficulty: 'medium',
  timerEnabled: true,
  soundEnabled: false
};

const loadSettingsFromStorage = () => {
  try {
    const raw = localStorage.getItem('igh_settings');
    if (!raw) return;
    const stored = JSON.parse(raw);
    if (stored.difficulty) state.difficulty = stored.difficulty;
    if (typeof stored.timerEnabled === 'boolean') state.timerEnabled = stored.timerEnabled;
    if (typeof stored.soundEnabled === 'boolean') state.soundEnabled = stored.soundEnabled;
  } catch {}
};

const persistSettings = () => {
  localStorage.setItem('igh_settings', JSON.stringify(state));
};

const syncSettingsUI = () => {
  difficultySelect.value = state.difficulty;
  timerEnabledCheckbox.checked = state.timerEnabled;
  soundEnabledCheckbox.checked = state.soundEnabled;
};

const showHome = () => {
  homeView.classList.remove('hidden');
  gameView.classList.add('hidden');
};

export const showGame = () => {
  homeView.classList.add('hidden');
  gameView.classList.remove('hidden');
};

btnHome.addEventListener('click', () => {
  showHome();
});

btnSettings.addEventListener('click', () => settingsDialog.showModal());

settingsDialog.addEventListener('close', () => {
  state.difficulty = difficultySelect.value;
  state.timerEnabled = !!timerEnabledCheckbox.checked;
  state.soundEnabled = !!soundEnabledCheckbox.checked;
  persistSettings();
});

difficultySelect.addEventListener('change', () => {
  state.difficulty = difficultySelect.value;
});

timerEnabledCheckbox.addEventListener('change', () => {
  state.timerEnabled = !!timerEnabledCheckbox.checked;
});

soundEnabledCheckbox.addEventListener('change', () => {
  state.soundEnabled = !!soundEnabledCheckbox.checked;
});

btnDaily.addEventListener('click', async () => {
  try {
    btnDaily.disabled = true;
    showGame();
    await startDailyChallengeFromHome(state);
  } catch (err) {
    console.error('Failed to start Daily Challenge:', err);
    alert('Failed to start Daily Challenge. Please check the console for details.');
  } finally {
    btnDaily.disabled = false;
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  loadSettingsFromStorage();
  syncSettingsUI();
  await loadCategories(async (category) => {
    showGame();
    await startQuickPlay(category, state);
  });
}); 