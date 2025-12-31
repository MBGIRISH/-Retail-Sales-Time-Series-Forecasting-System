
import { SalesData, SeasonalDecomposition, ForecastPoint } from './types';

export const generateSalesData = (years: number = 3): SalesData[] => {
  const data: SalesData[] = [];
  const startDate = new Date('2021-01-01');
  const endDate = new Date();
  
  let current = new Date(startDate);
  let baseSales = 1000;
  const trend = 0.5; // Monthly growth
  
  while (current <= endDate) {
    const day = current.getDay();
    const month = current.getMonth();
    const dateStr = current.toISOString().split('T')[0];
    
    // Yearly Seasonality (Peak in Nov/Dec)
    let seasonalMultiplier = 1.0;
    if (month === 10 || month === 11) seasonalMultiplier = 1.4;
    if (month === 0) seasonalMultiplier = 0.8; // Post holiday dip
    
    // Weekly Seasonality (Weekends high)
    const weeklyMultiplier = (day === 0 || day === 6) ? 1.3 : 0.9;
    
    // Random Promotion
    const hasPromotion = Math.random() > 0.92;
    const promoMultiplier = hasPromotion ? 1.5 : 1.0;
    
    // Noise
    const noise = 1 + (Math.random() - 0.5) * 0.2;
    
    const dailyGrowth = (current.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30) * trend;
    const sales = Math.floor((baseSales + dailyGrowth) * seasonalMultiplier * weeklyMultiplier * promoMultiplier * noise);
    
    data.push({
      date: dateStr,
      sales,
      promotion: hasPromotion,
      holiday: false, // Could add holiday logic
      store_id: 'STORE_001',
      product_category: 'Electronics'
    });
    
    current.setDate(current.getDate() + 1);
  }
  
  return data;
};

export const decomposeData = (data: SalesData[]): SeasonalDecomposition[] => {
  // Simple moving average trend for visual representation
  const trendWindow = 30;
  return data.map((d, i) => {
    const start = Math.max(0, i - trendWindow / 2);
    const end = Math.min(data.length, i + trendWindow / 2);
    const window = data.slice(start, end);
    const trendValue = window.reduce((sum, val) => sum + val.sales, 0) / window.length;
    
    return {
      date: d.date,
      observed: d.sales,
      trend: trendValue,
      seasonal: d.sales - trendValue, // simplified for demo
      residual: Math.random() * 50 - 25
    };
  });
};

export const generateForecast = (lastActual: number, horizonDays: number = 90): ForecastPoint[] => {
  const forecast: ForecastPoint[] = [];
  const lastDate = new Date();
  
  for (let i = 1; i <= horizonDays; i++) {
    const current = new Date(lastDate);
    current.setDate(current.getDate() + i);
    
    const base = lastActual + (i * 0.8);
    const noise = 1 + (Math.random() - 0.5) * 0.1;
    const value = Math.floor(base * noise);
    
    forecast.push({
      date: current.toISOString().split('T')[0],
      forecast: value,
      lower_ci: value * 0.9,
      upper_ci: value * 1.1
    });
  }
  
  return forecast;
};
