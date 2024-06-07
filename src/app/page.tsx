"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useLocale from './useLocale';

interface ExchangeRate {
  currency: string;
  code: string;
  mid: number;
}

const Home: React.FC = () => {
  const { locale, toggleLocale, labels } = useLocale();
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [alertMessage, setAlertMessage] = useState<string>('');

  const fetchExchangeRates = async (selectedDate: string, retry: boolean = false) => {
    try {
      const response = await axios.get(`https://api.nbp.pl/api/exchangerates/tables/A/${selectedDate}/`);
      const rates = response.data[0].rates;
      rates.push({ currency: locale === 'en' ? 'Polish Zloty' : 'Polski Złoty', code: 'PLN', mid: 1 }); // Add PLN manually
      setExchangeRates(rates);
      setAlertMessage('');
    } catch (error) {
      if (!retry) {
        setAlertMessage(labels.todayUnavailable);
        setTimeout(() => {
          const previousDate = new Date(selectedDate);
          previousDate.setDate(previousDate.getDate() - 1);
          setDate(previousDate.toISOString().split('T')[0]);
          fetchExchangeRates(previousDate.toISOString().split('T')[0], true);
        }, 3000);
      } else {
        setAlertMessage(labels.apiUnavailable);
      }
    }
  };

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  useEffect(() => {
    fetchExchangeRates(date);
  }, [date, locale]);

  const handleConvert = () => {
    if (!amount) {
      setAlertMessage(labels.emptyAmount);
      return;
    }
    const fromRate = exchangeRates.find(rate => rate.code === fromCurrency)?.mid;
    const toRate = exchangeRates.find(rate => rate.code === toCurrency)?.mid;
    if (fromRate && toRate) {
      setConvertedAmount((parseFloat(amount) * fromRate) / toRate);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen p-8 bg-gray-100 relative">
      <button
        onClick={toggleLocale}
        className="mb-4 bg-blue-500 text-white p-2 rounded"
        aria-label={locale === 'en' ? 'Switch to Polish' : 'Przełącz na Angielski'}
      >
        {locale === 'en' ? 'Switch to Polish' : 'Przełącz na Angielski'}
      </button>
      <h1 className="text-4xl font-bold text-center mb-8">{labels.title}</h1>
      {alertMessage && (
        <div
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-yellow-200 text-yellow-800 rounded"
          role="alert"
        >
          {alertMessage}
        </div>
      )}
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="amount" className="block text-gray-700">{labels.amount}</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            aria-required="true"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700">{labels.date}</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={today}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            aria-required="true"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="fromCurrency" className="block text-gray-700">{labels.fromCurrency}</label>
          <select
            id="fromCurrency"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            aria-required="true"
          >
            {exchangeRates.map((rate) => (
              <option key={rate.code} value={rate.code}>
                {rate.code}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="toCurrency" className="block text-gray-700">{labels.toCurrency}</label>
          <select
            id="toCurrency"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            aria-required="true"
          >
            {exchangeRates.map((rate) => (
              <option key={rate.code} value={rate.code}>
                {rate.code}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleConvert}
          className="w-full bg-blue-500 text-white p-2 rounded mt-4"
          aria-label={labels.convert}
        >
          {labels.convert}
        </button>
        {convertedAmount !== null && (
          <div className="mt-4">
            <h2 className="text-2xl font-bold">
              {labels.convertedAmount}: {convertedAmount.toFixed(2)} {toCurrency}
            </h2>
          </div>
        )}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-center mb-4">{labels.exchangeRatesOn} {date}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white" aria-label="Exchange Rates">
            <thead>
            <tr>
              <th className="px-4 py-2 border">Currency</th>
              <th className="px-4 py-2 border">Code</th>
              <th className="px-4 py-2 border">Rate</th>
            </tr>
            </thead>
            <tbody>
            {exchangeRates.map((rate) => (
              <tr key={rate.code}>
                <td className="px-4 py-2 border">{rate.currency}</td>
                <td className="px-4 py-2 border">{rate.code}</td>
                <td className="px-4 py-2 border">{rate.mid}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
