export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface ExchangeRate {
  code: string;
  rate: number;
}

export interface ConversionResult {
  amount: number;
  from: string;
  to: string;
  result: number;
  rate: number;
  lastUpdated: string;
}