import type { CurrencyExchangeData } from '../lib/countries';
import type { CurrencySymbols } from '../lib/allCurrencies';

export const convert = (
  value: string,
  fromCurrencySymbol: CurrencySymbols,
  toCurrencySymbol: CurrencySymbols,
  exchangeRateData: CurrencyExchangeData
) => {
  if (!exchangeRateData[toCurrencySymbol]) {
    return;
  }

  const fromCurrencyRate = exchangeRateData[toCurrencySymbol];
  const toCurrencyRate = exchangeRateData[fromCurrencySymbol];

  const amount = (Number(value) * fromCurrencyRate) / toCurrencyRate;

  return amount.toFixed(2);
};

export const generateUniqueRandomValues = (min: number, max: number, n: number): number[] => {
  if (max - min + 1 < n) {
    throw new Error('Range is smaller than the number of unique values required.');
  }

  const result: Set<number> = new Set();
  while (result.size < n) {
    const randomValue: number = Math.floor(Math.random() * (max - min + 1)) + min;
    result.add(randomValue);
  }

  return Array.from(result);
};

export const getValueFromSessionStorage = (key: string) => {
  const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')();

  if (!isBrowser) {
    return;
  }

  if (!sessionStorage || !window?.sessionStorage) {
    return;
  }

  const value = sessionStorage.getItem(key);

  if (value) {
    return JSON.parse(value);
  }

  return null;
};

export const setValueInSessionStorage = (key: string, value: unknown) => {
  const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')();

  if (!isBrowser) {
    return;
  }

  if (!sessionStorage || !window?.sessionStorage) {
    return;
  }

  sessionStorage.setItem(key, JSON.stringify(value));
};