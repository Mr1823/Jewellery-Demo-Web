/**
 * Safari-safe localStorage wrapper.
 * Safari in Private Mode throws a DOMException on any localStorage access.
 * All localStorage calls in the app MUST go through these helpers.
 */

const safeStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // Safari private mode — silently fail
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // Safari private mode — silently fail
    }
  },
};

export default safeStorage;

/**
 * Safely parse a date string across all browsers including Safari.
 * Safari rejects "YYYY-MM-DD HH:MM:SS" (space separator).
 * This normalizes it to ISO 8601 "YYYY-MM-DDTHH:MM:SS" which Safari accepts.
 * Falls back to 0 (epoch) if date is invalid.
 */
export const safeParseDateMs = (dateStr) => {
  if (!dateStr) return 0;
  if (typeof dateStr === "number") return dateStr;
  // Replace space separator with 'T' so Safari's strict parser accepts it
  const normalized = String(dateStr).replace(" ", "T");
  const ms = new Date(normalized).getTime();
  return isNaN(ms) ? 0 : ms;
};
