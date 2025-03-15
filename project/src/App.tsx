import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';
import { currencies } from './currencies';
import { fetchExchangeRates } from './api';
import type { Currency, ConversionResult, ExchangeRate } from './types';

function App() {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<Currency>(currencies[0]);
  const [toCurrency, setToCurrency] = useState<Currency>(currencies[1]);
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    updateRates();
  }, [fromCurrency]);

  const updateRates = async () => {
    setLoading(true);
    const newRates = await fetchExchangeRates(fromCurrency.code);
    setRates(newRates);
    setLoading(false);
  };

  const handleConvert = () => {
    const rate = rates.find(r => r.code === toCurrency.code)?.rate || 0;
    const calculatedResult = parseFloat(amount) * rate;
    
    setResult({
      amount: parseFloat(amount),
      from: fromCurrency.code,
      to: toCurrency.code,
      result: calculatedResult,
      rate,
      lastUpdated: new Date().toLocaleString(),
    });
  };

  const switchCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const currencyOptions = currencies.map(currency => ({
    value: currency,
    label: `${currency.code} - ${currency.name}`,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Currency Converter
        </h1>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <Select
                value={{ value: fromCurrency, label: `${fromCurrency.code} - ${fromCurrency.name}` }}
                options={currencyOptions}
                onChange={(option) => option && setFromCurrency(option.value)}
                className="text-sm"
              />
            </div>

            <button
              onClick={switchCurrencies}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowRightLeft className="w-6 h-6 text-gray-600" />
            </button>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <Select
                value={{ value: toCurrency, label: `${toCurrency.code} - ${toCurrency.name}` }}
                options={currencyOptions}
                onChange={(option) => option && setToCurrency(option.value)}
                className="text-sm"
              />
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleConvert}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              Convert
            </button>
            <button
              onClick={updateRates}
              className="px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh Rates
            </button>
          </div>

          {result && (
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-800">
                  {result.amount.toLocaleString()} {result.from} =
                </p>
                <p className="text-4xl font-bold text-blue-600 mt-2">
                  {result.result.toLocaleString(undefined, { maximumFractionDigits: 2 })} {result.to}
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  1 {result.from} = {result.rate.toFixed(4)} {result.to}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Last updated: {result.lastUpdated}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;