export const normalizeWord = (w) => w.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// xorshift32 RNG
export const createRng = (seed) => {
  let state = seed >>> 0;
  if (state === 0) state = 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0xffffffff;
  };
};

export const shuffleInPlace = (arr, rand) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const pickRandom = (arr, rand) => arr[Math.floor(rand() * arr.length)];

export const timeToMMSS = (sec) => {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export const todayYYYYMMDD = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
};

// Fallback hash (FNV-1a 32-bit) for non-secure contexts (e.g., file://)
const fnv1a32Hex = (text) => {
  let hash = 0x811c9dc5; // offset basis
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = (hash >>> 0) * 0x01000193; // FNV prime
    hash >>>= 0;
  }
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  return hex;
};

export const sha256Hex = async (text) => {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle && location.protocol !== 'file:') {
      const enc = new TextEncoder();
      const data = enc.encode(text);
      const hash = await crypto.subtle.digest('SHA-256', data);
      const bytes = Array.from(new Uint8Array(hash));
      return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {}
  // Fallback for file:// or when subtle is unavailable
  return fnv1a32Hex(text);
};

export const hexToUint32 = (hex) => {
  // Use first 8 hex chars
  const slice = hex.slice(0, 8);
  return parseInt(slice, 16) >>> 0;
};

export const liveAnnounce = (msg) => {
  const el = document.getElementById('live-region');
  if (!el) return;
  el.textContent = '';
  setTimeout(() => (el.textContent = msg), 10);
}; 