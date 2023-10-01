export const parse = (s) => {
  try {
    return JSON.parse(s);
  } catch (e) {
    return null;
  }
};

export const least = (a, b) => Math.min(a, b);

export const daysSeconds = (seconds) => (seconds / secondsPerDay) | 0;
export const secondsDays = (days) => (days * secondsPerDay) | 0;

export const secondsPerDay = 24 * 3600;
export const nowSeconds = (Date.now() / 1000) | 0;
export const nowDays = daysSeconds(nowSeconds);

