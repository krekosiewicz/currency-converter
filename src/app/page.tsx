"use client";
import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios'
import useLocale from './useLocale';
import 'react-datepicker/dist/react-datepicker.css';
import ReactDatePicker from 'react-datepicker'
import useAlert from '@/app/useAlert'
import AlertComponent from '@/app/alertComponent'

interface ExchangeRate {
  currency: string;
  code: string;
  mid: number;
}

const getYesterdayDate = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  return today.toISOString().split('T')[0];
};


const Home: React.FC = () => {
  const { locale, toggleLocale, labels } = useLocale();
  const { alertMessage, triggerAlert, clearAlert } = useAlert();
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [date, setDate] = useState<string>(getYesterdayDate());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const fetchExchangeRates = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://api.nbp.pl/api/exchangerates/tables/A/${date}/`, {
          cancelToken: source.token
        });
        const rates: ExchangeRate[] = response.data[0].rates;
        rates.push({ currency: locale === 'en' ? 'Polish Zloty' : 'Polski Złoty', code: 'PLN', mid: 1 });
        setExchangeRates(rates);
        clearAlert();  // Using custom hook to manage alerts
      } catch (error) {
        const axiosError = error as AxiosError;
        if (!axios.isCancel(axiosError)) {
          triggerAlert(labels.apiUnavailable);  // Using custom hook to manage alerts
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
    return () => source.cancel('Component unmounted, request canceled');
  }, [date, locale]);  // Correct dependencies

  const handleConvert = () => {
    if (!amount) {
      triggerAlert(labels.emptyAmount);  // Using custom hook to manage alerts
      return;
    }
    const fromRate = exchangeRates.find(rate => rate.code === fromCurrency)?.mid;
    const toRate = exchangeRates.find(rate => rate.code === toCurrency)?.mid;
    if (fromRate && toRate) {
      setConvertedAmount((parseFloat(amount) * fromRate) / toRate);
    } else {
      triggerAlert('Conversion rates not found.');  // Inform the user if rates are not found
    }
  };

  return (
    <div className="min-h-screen p-8 pt-0 bg-terminal relative">
      <div className="flex items-center justify-end w-full p-4 sticky top-0 bg-terminal z-10">
        <h1 className="text-2xl sm:text-4xl font-bold text-fontOnTerminal text-center md:my-2 flex-1">{labels.title}</h1>
        <button
          onClick={toggleLocale}
          className="bg-primary text-terminal p-2 rounded ml-2"
          aria-label={locale === 'en' ? 'Switch to Polish' : 'Przełącz na Angielski'}
        >
          {locale === 'en' ? 'Polish' : 'Angielski'}
        </button>
      </div>
      <AlertComponent message={alertMessage} clearAlert={clearAlert} />
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="amount" className="block text-gray-700">{labels.amount}</label>
          <input
            id="amount"
            type="number"
            step="0.01"  // Allow decimal values to two decimal places
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            aria-required="true"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="datePicker" className="block text-gray-700">{labels.date}</label>
          <ReactDatePicker
            id="datePicker"
            selected={new Date(date)}
            onChange={(date) => setDate((date as Date).toISOString().split('T')[0])}
            maxDate={new Date()}
            dateFormat="yyyy-MM-dd"
            aria-label="Select a date"
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="fromCurrency" className="block text-gray-700">{labels.fromCurrency}</label>
          <select
            id="fromCurrency"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1 custom-select"
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
            className="w-full p-2 border border-gray-300 rounded mt-1 custom-select"
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
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleConvert()
            }
          }}
          className="w-full bg-primary text-terminal p-2 rounded mt-4"
          aria-label={labels.convert}
          tabIndex={0}  // Ensure the button is focusable
        >
          {labels.convert}
        </button>
        {convertedAmount !== null && (
          <div className="mt-4">
            <h2 className="text-2xl font-bold ">
              {labels.convertedAmount}: {convertedAmount.toFixed(2)} {toCurrency}
            </h2>
          </div>
        )}
      </div>
      <div className="mt-8 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-fontOnTerminal text-center mb-4">
          {labels.exchangeRatesOn} <span className="whitespace-nowrap">{date}</span>
        </h2>
        <div className="grid grid-cols-fr-min-min bg-white p-6 rounded-lg shadow-lg w-full">
          <div className="font-bold p-2 bg-terminal text-fontOnTerminal rounded-tl-lg">{labels.currency}</div>
          <div className="font-bold p-2 bg-terminal text-fontOnTerminal">{labels.code}</div>
          <div className="font-bold p-2 bg-terminal text-fontOnTerminal rounded-tr-lg">{labels.rate}</div>
          {exchangeRates.map((rate, index) => (
            <React.Fragment key={rate.code}>
              <div className={`p-2 py-4 break-words ${index % 2 ? 'bg-gray-100' : 'bg-white'}`}>{rate.currency}</div>
              <div className={`p-2 py-4 ${index % 2 ? 'bg-gray-100' : 'bg-white'}`}>{rate.code}</div>
              <div className={`p-2 py-4 break-all-380  ${index % 2 ? 'bg-gray-100' : 'bg-white'}`}>{rate.mid}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
