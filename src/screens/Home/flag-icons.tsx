/**
 * Converts a letter to a Regional Indicator Symbol.
 * @param  {string} letter
 * @return {string}
 */
function getRegionalIndicatorSymbol(letter: string): string {
  return String.fromCodePoint(
    0x1f1e6 - 65 + letter.toUpperCase().charCodeAt(0)
  );
}

/**
 * Creates Unicode flag from a two-letter ISO country code.
 * https://stackoverflow.com/questions/24050671/how-to-put-japan-flag-character-in-a-string
 * @param  {string} country — A two-letter ISO country code (case-insensitive).
 * @return {string}
 */
export function getCountryFlag(country: string): string {
  return (
    getRegionalIndicatorSymbol(country[0]) +
    getRegionalIndicatorSymbol(country[1])
  );
}
