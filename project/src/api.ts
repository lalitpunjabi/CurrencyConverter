import axios from 'axios';
import { ExchangeRate } from './types';

const BASE_URL = 'https://open.er-api.com/v6/latest';

export const fetchExchangeRates = async (baseCode: string): Promise<ExchangeRate[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/${baseCode}`);
    const rates = response.data.rates;
    return Object.entries(rates).map(([code, rate]) => ({
      code,
      rate: rate as number,
    }));
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return [];
  }
};