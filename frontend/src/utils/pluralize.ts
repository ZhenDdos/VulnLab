export const pluralize = (
  count: number,
  words: [string, string, string],
): string => {
  const absCount = Math.abs(count);
  const lastDigit = absCount % 10;
  const lastTwoDigits = absCount % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return words[2];
  }

  if (lastDigit === 1) {
    return words[0];
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return words[1];
  }

  return words[2];
};
