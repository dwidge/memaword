export const getSecond = () => (new Date() / 1000) | 0;

export const getDaysFromSeconds = (s) =>
((s | 0) / (60 * 60 * 24)) | 0;

export const getDates = (pairs) =>
  pairs.map(({ views: [{ date = 0, next = 0 } = {}] = [] }) => next | 0);

export const calcFirstDate = (pairs) =>
  getDates(pairs)
    .filter((n) => n)
    .sort()[0];

export const steps = [1, 2, 3, 1 * 60, 2 * 60, 3 * 60, 60 * 60 * 24];

export const getStep = (level) =>
  steps[level] || steps.at(-1) * 2 ** (level - steps.length + 1);
