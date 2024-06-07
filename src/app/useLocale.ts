import { useState, useEffect } from 'react';

type Locale = 'en' | 'pl';  // Define allowed locale types

interface Labels {
  title: string;
  amount: string;
  date: string;
  fromCurrency: string;
  toCurrency: string;
  convert: string;
  convertedAmount: string;
  exchangeRatesOn: string;
  todayUnavailable: string;
  apiUnavailable: string;
  emptyAmount: string;
  currency: string;
  code: string;
  rate: string;
}

interface LocaleLabels {
  en: Labels;
  pl: Labels;
}

const useLocale = () => {
  const [locale, setLocale] = useState<Locale>('pl');  // Use Locale type here

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'pl')) {
      setLocale(savedLocale);
    }
  }, []);

  const toggleLocale = () => {
    const newLocale: Locale = locale === 'en' ? 'pl' : 'en';
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const labels: LocaleLabels = {
    en: {
      title: 'Currency Converter',
      amount: 'Amount',
      date: 'Date',
      fromCurrency: 'From Currency',
      toCurrency: 'To Currency',
      convert: 'Convert',
      convertedAmount: 'Converted Amount',
      exchangeRatesOn: 'Exchange Rates on',
      todayUnavailable: 'Exchange rates for today are not available yet, fetching rates for the previous date.',
      apiUnavailable: 'API is not available. Please try again later or select a different date.',
      emptyAmount: 'Please enter an amount to convert.',
      currency: 'Currency',
      code: 'Code',
      rate: 'Rate'
    },
    pl: {
      title: 'Przelicznik Walut',
      amount: 'Kwota',
      date: 'Data',
      fromCurrency: 'Z Waluty',
      toCurrency: 'Na Walutę',
      convert: 'Przelicz',
      convertedAmount: 'Przeliczona Kwota',
      exchangeRatesOn: 'Kursy Walut na',
      todayUnavailable: 'Kursy walut na dzisiaj nie są jeszcze dostępne, pobieranie kursów na poprzednią datę.',
      apiUnavailable: 'API jest niedostępne. Spróbuj ponownie później lub wybierz inną datę.',
      emptyAmount: 'Proszę wprowadzić kwotę do przeliczenia.',
      currency: 'Waluta',
      code: 'Kod',
      rate: 'Stawka'
    }
  };

  return {
    locale,
    toggleLocale,
    labels: labels[locale],
  };
};

export default useLocale;
