import { useState, useEffect } from 'react';

const useLocale = () => {
  const [locale, setLocale] = useState<string>('pl');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale) {
      setLocale(savedLocale);
    }
  }, []);

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'pl' : 'en';
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const labels = {
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
    }
  };

  return {
    locale,
    toggleLocale,
    labels: labels[locale],
  };
};

export default useLocale;
