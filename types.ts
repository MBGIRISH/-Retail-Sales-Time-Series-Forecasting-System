
export interface SalesData {
  date: string;
  sales: number;
  promotion: boolean;
  holiday: boolean;
  store_id: string;
  product_category: string;
}

export interface ModelMetrics {
  mae: number;
  rmse: number;
  mape: number;
}

export interface ForecastPoint {
  date: string;
  actual?: number;
  forecast: number;
  lower_ci: number;
  upper_ci: number;
}

export interface SeasonalDecomposition {
  date: string;
  observed: number;
  trend: number;
  seasonal: number;
  residual: number;
}

export enum Section {
  Introduction = 'Introduction',
  EDA = 'Exploratory Data Analysis',
  Preprocessing = 'Preprocessing & Features',
  Modeling = 'Modeling Approaches',
  Evaluation = 'Model Evaluation',
  Forecasting = 'Future Projections',
  Insights = 'Business Insights',
  Production = 'Production Thinking'
}
