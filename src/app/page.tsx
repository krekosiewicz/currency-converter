"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ExchangeRate {
  currency: string;
  code: string;
  mid: number;
}

const Home: React.FC = () => {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      const response = await axios.get('https://api.nbp.pl/api/exchangerates/tables/A/');
      const rates = response.data[0].rates;
      rates.push({ currency: 'Polish Zloty', code: 'PLN', mid: 1 }); // Add PLN manually
      setExchangeRates(rates);
    };

    fetchExchangeRates();
  }, []);

  const handleConvert = () => {
    const fromRate = exchangeRates.find(rate => rate.code === fromCurrency)?.mid;
    const toRate = exchangeRates.find(rate => rate.code === toCurrency)?.mid;
    if (fromRate && toRate) {
      // Correct calculation
      setConvertedAmount((parseFloat(amount) * fromRate) / toRate);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-8">Currency Converter</h1>
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block text-gray-700">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">From Currency</label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            {exchangeRates.map((rate) => (
              <option key={rate.code} value={rate.code}>
                {rate.code}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">To Currency</label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
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
        >
          Convert
        </button>
        {convertedAmount !== null && (
          <div className="mt-4">
            <h2 className="text-2xl font-bold">
              Converted Amount: {convertedAmount.toFixed(2)} {toCurrency}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
