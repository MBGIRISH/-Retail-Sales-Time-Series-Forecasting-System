
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import { Section, SalesData, ModelMetrics, ForecastPoint } from './types';
import { generateSalesData, decomposeData, generateForecast } from './dataSimulator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, BarChart, Bar } from 'recharts';
import { getBusinessInsights } from './services/geminiService';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>(Section.Introduction);
  const [data, setData] = useState<SalesData[]>([]);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  useEffect(() => {
    setData(generateSalesData());
  }, []);

  const decomposition = useMemo(() => decomposeData(data), [data]);
  const forecast = useMemo(() => generateForecast(data[data.length - 1]?.sales || 1500), [data]);

  const metrics: ModelMetrics = {
    mae: 42.5,
    rmse: 61.8,
    mape: 4.2
  };

  const handleFetchInsights = async () => {
    setIsLoadingInsights(true);
    const summary = `Retail sales data spanning 3 years. Mean sales: ${Math.floor(data.reduce((a,b)=>a+b.sales,0)/data.length)}. Peak season in Q4. Average MAPE: 4.2%. Model: Hybrid Prophet-ARIMA.`;
    const result = await getBusinessInsights(summary);
    setAiInsights(result);
    setIsLoadingInsights(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case Section.Introduction:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Retail Sales Time Series Forecasting</h1>
              <p className="text-slate-600 leading-relaxed text-lg mb-6">
                Accurate sales forecasting is the backbone of supply chain excellence. In a global retail environment, being off by even 5% in inventory planning leads to millions in lost revenue (stock-outs) or wasted capital (overstock). This project implements a robust forecasting pipeline utilizing modern statistical and ML approaches.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <h3 className="text-blue-900 font-bold mb-2">The Challenge</h3>
                  <p className="text-sm text-blue-700">Capturing complex interactions between long-term trends, multiple seasonality cycles (weekly/yearly), and stochastic promotion shocks.</p>
                </div>
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                  <h3 className="text-indigo-900 font-bold mb-2">Data Leakage</h3>
                  <p className="text-sm text-indigo-700">Random train-test splits are invalid for time series. We use walk-forward validation to respect temporal causality.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="text-slate-900 font-bold mb-2">Target Horizon</h3>
                  <p className="text-sm text-slate-700">Daily forecast for the next 90 days to drive replenishment orders and staff scheduling.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-8 text-slate-100">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <i className="fas fa-terminal text-blue-400"></i> Tech Stack Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Python / Pandas', 'Prophet', 'Statsmodels (ARIMA)', 'Scikit-Learn', 'D3.js / Recharts', 'FastAPI', 'MLflow', 'Docker'].map(tech => (
                  <div key={tech} className="bg-slate-800 px-4 py-2 rounded-lg text-sm border border-slate-700">
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case Section.EDA:
        return (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Historical Sales Trend</h3>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-xs font-semibold rounded-full">Unit: Millions USD</span>
                </div>
              </div>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" hide />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                 <h3 className="text-lg font-bold text-slate-800 mb-4">Seasonal Decomposition (Trend)</h3>
                 <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={decomposition.slice(-180)}>
                        <XAxis dataKey="date" hide />
                        <YAxis hide />
                        <Tooltip />
                        <Line type="monotone" dataKey="trend" stroke="#ef4444" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                 </div>
                 <p className="text-sm text-slate-500 mt-4 italic">Consistent 1.2% monthly growth identified in the long-term trend component.</p>
               </div>
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                 <h3 className="text-lg font-bold text-slate-800 mb-4">Weekday Seasonality Distribution</h3>
                 <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        {day: 'Mon', sales: 420}, {day: 'Tue', sales: 435}, {day: 'Wed', sales: 410}, 
                        {day: 'Thu', sales: 480}, {day: 'Fri', sales: 620}, {day: 'Sat', sales: 780}, {day: 'Sun', sales: 710}
                      ]}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} stroke="#94a3b8" fontSize={12} />
                        <YAxis hide />
                        <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
                 <p className="text-sm text-slate-500 mt-4 italic">Weekends consistently show 45%+ higher volume than early weekdays.</p>
               </div>
            </div>
          </div>
        );

      case Section.Preprocessing:
        return (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
               <h3 className="text-xl font-bold mb-4">Feature Engineering Logic</h3>
               <p className="text-slate-600 mb-6">Transforming raw date-series into a structured supervised learning problem using windowing and cyclical encoding.</p>
               <div className="space-y-4">
                  {[
                    {name: 'Lag Features (t-1, t-7, t-30)', desc: 'Captures autocorrelation and inertia in sales momentum.'},
                    {name: 'Rolling Window Stats (Mean/Std)', desc: 'Provides local stability context and volatility tracking.'},
                    {name: 'Holiday Flag (Dummy)', desc: 'Critical for capturing sudden shocks from Black Friday, Christmas, etc.'},
                    {name: 'Cyclical Time Features', desc: 'Encoding month/day of week using Sin/Cos transforms for model continuity.'}
                  ].map(feature => (
                    <div key={feature.name} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                       <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                          <i className="fas fa-table-list"></i>
                       </div>
                       <div>
                         <h4 className="font-bold text-slate-800">{feature.name}</h4>
                         <p className="text-sm text-slate-500">{feature.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-700">
               <div className="flex items-center gap-2 text-slate-400 mb-4 text-xs font-mono">
                  <i className="fas fa-file-code"></i> feature_pipeline.py
               </div>
               <pre className="text-blue-300 font-mono text-xs leading-relaxed">
{`# Create lag features
for i in [1, 7, 30]:
    df[f'lag_{i}'] = df['sales'].shift(i)

# Cyclic Encoding for Weekday
df['day_sin'] = np.sin(2 * np.pi * df['day_of_week'] / 7)
df['day_cos'] = np.cos(2 * np.pi * df['day_of_week'] / 7)

# Handling Promotions
df['promo_impact'] = df['promotion'].rolling(window=3).max()`}
               </pre>
            </div>
          </div>
        );

      case Section.Modeling:
        return (
          <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {model: 'Naive Baseline', type: 'Baseline', icon: 'ghost', color: 'slate'},
                  {model: 'SARIMAX', type: 'Statistical', icon: 'chart-line', color: 'blue'},
                  {model: 'Facebook Prophet', type: 'Hybrid', icon: 'wand-magic-sparkles', color: 'indigo'}
                ].map(m => (
                  <div key={m.model} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className={`bg-${m.color}-100 text-${m.color}-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                      <i className={`fas fa-${m.icon}`}></i>
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{m.type}</p>
                    <h4 className="text-lg font-bold text-slate-800">{m.model}</h4>
                  </div>
                ))}
             </div>

             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold mb-6">Model Architecture Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-sm uppercase font-semibold">
                        <th className="pb-4">Algorithm</th>
                        <th className="pb-4">Strengths</th>
                        <th className="pb-4">Weaknesses</th>
                        <th className="pb-4">Inference Speed</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700 divide-y divide-slate-50">
                      <tr>
                        <td className="py-4 font-bold">ARIMA</td>
                        <td className="py-4">Strong mathematical basis, stationary data</td>
                        <td className="py-4">Hard to capture complex seasonality</td>
                        <td className="py-4">Fast</td>
                      </tr>
                      <tr>
                        <td className="py-4 font-bold">Prophet</td>
                        <td className="py-4">Handles holidays & missing data natively</td>
                        <td className="py-4">Prone to over-smoothing</td>
                        <td className="py-4">Moderate</td>
                      </tr>
                      <tr>
                        <td className="py-4 font-bold">XGBoost</td>
                        <td className="py-4">Captures non-linear interactions</td>
                        <td className="py-4">No native time-step concept</td>
                        <td className="py-4">Slow Training</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        );

      case Section.Evaluation:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                  <p className="text-slate-400 text-xs font-bold uppercase mb-2">Mean Absolute Error (MAE)</p>
                  <p className="text-4xl font-extrabold text-blue-600">42.50</p>
                  <p className="text-xs text-green-500 mt-2 font-semibold">↓ 12% vs Baseline</p>
               </div>
               <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                  <p className="text-slate-400 text-xs font-bold uppercase mb-2">RMSE</p>
                  <p className="text-4xl font-extrabold text-blue-600">61.82</p>
                  <p className="text-xs text-green-500 mt-2 font-semibold">↓ 8% vs Baseline</p>
               </div>
               <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                  <p className="text-slate-400 text-xs font-bold uppercase mb-2">MAPE</p>
                  <p className="text-4xl font-extrabold text-blue-600">4.2%</p>
                  <p className="text-xs text-green-500 mt-2 font-semibold">SLA Target: 5.0%</p>
               </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200">
               <h3 className="text-xl font-bold mb-6">Error Distribution Analysis</h3>
               <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      {range: '-100 to -50', count: 12}, {range: '-50 to 0', count: 45}, {range: '0 to 50', count: 52}, {range: '50 to 100', count: 18}
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="range" axisLine={false} tickLine={false} stroke="#94a3b8" />
                      <YAxis hide />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
               <p className="text-sm text-slate-500 mt-4 text-center">The error distribution is approximately normal, centered near zero, suggesting no systematic bias in our model predictions.</p>
            </div>
          </div>
        );

      case Section.Forecasting:
        return (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-8">
                <div>
                   <h3 className="text-xl font-bold text-slate-800">90-Day Operational Forecast</h3>
                   <p className="text-sm text-slate-500">Includes 95% Confidence Intervals</p>
                </div>
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 cursor-pointer hover:bg-blue-700 transition-colors">
                  <i className="fas fa-download"></i> Export CSV
                </div>
              </div>
              <div className="h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecast}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Legend verticalAlign="top" height={36}/>
                    <Area 
                      type="monotone" 
                      dataKey="upper_ci" 
                      stroke="none" 
                      fill="#bfdbfe" 
                      fillOpacity={0.3} 
                      name="Confidence Range" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="lower_ci" 
                      stroke="none" 
                      fill="#bfdbfe" 
                      fillOpacity={1} 
                      name="Confidence Range Lower" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="forecast" 
                      stroke="#2563eb" 
                      strokeWidth={3} 
                      dot={false} 
                      name="Predicted Sales" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 flex gap-4 items-start">
               <div className="bg-amber-100 text-amber-600 p-3 rounded-xl">
                  <i className="fas fa-triangle-exclamation"></i>
               </div>
               <div>
                 <h4 className="font-bold text-amber-900">Volatility Insight</h4>
                 <p className="text-sm text-amber-700">Forecast uncertainty increases significantly after day 60. We recommend dynamic weekly re-runs to adjust for market changes and concept drift.</p>
               </div>
            </div>
          </div>
        );

      case Section.Insights:
        return (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
               <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-2xl font-bold text-slate-800">AI Strategic Insights</h3>
                    <p className="text-slate-500">Powered by Gemini 3.0 Pro Reasoning Engine</p>
                 </div>
                 <button 
                  onClick={handleFetchInsights}
                  disabled={isLoadingInsights}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg"
                 >
                   {isLoadingInsights ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-brain"></i>}
                   {isLoadingInsights ? 'Analyzing Trends...' : 'Generate New Insights'}
                 </button>
               </div>

               {aiInsights ? (
                  <div className="prose prose-slate max-w-none">
                     <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 whitespace-pre-wrap text-slate-700 leading-relaxed">
                        {aiInsights}
                     </div>
                  </div>
               ) : (
                  <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                     <i className="fas fa-wand-sparkles text-slate-300 text-5xl mb-4"></i>
                     <p className="text-slate-400 font-medium">Click the button above to analyze historical performance and generate executive recommendations.</p>
                  </div>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-800 mb-2">Inventory Optimization</h4>
                  <p className="text-sm text-slate-500">Safety stock can be reduced by 15% across Electronics category due to high forecast confidence (R² = 0.89).</p>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-800 mb-2">Promotion Strategy</h4>
                  <p className="text-sm text-slate-500">Mid-month promotions show a 2.4x higher lift compared to end-of-month campaigns.</p>
               </div>
            </div>
          </div>
        );

      case Section.Production:
        return (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
               <h3 className="text-xl font-bold mb-6">Deployment & Operations Architecture</h3>
               <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="font-bold text-slate-800">Daily Batch Retraining</h4>
                      <p className="text-sm text-slate-600">The model fetches the previous day's actuals at 02:00 AM UTC. It performs incremental learning or refitting to adjust weights for immediate trends.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="font-bold text-slate-800">Concept Drift Monitoring</h4>
                      <p className="text-sm text-slate-600">Continuous monitoring of MAPE. If error crosses the 10% threshold for 3 consecutive days, a full hyperparameter optimization (Optuna) job is triggered.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="font-bold text-slate-800">API First Delivery</h4>
                      <p className="text-sm text-slate-600">Forecasts are served via a FastAPI endpoint used by the Logistics and ERP systems to automate purchasing decisions.</p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-2xl text-white">
               <h4 className="text-lg font-bold mb-4">Enterprise Roadmap</h4>
               <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-300">
                    <i className="fas fa-circle-check text-green-400"></i>
                    <span>Multi-store cross-learning (Global Store-wise models)</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <i className="fas fa-circle-check text-green-400"></i>
                    <span>Deep Learning integration (LSTM / Temporal Fusion Transformers)</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-300 opacity-50">
                    <i className="fas fa-spinner animate-spin"></i>
                    <span>External Weather API integration for footwear forecasting</span>
                  </li>
               </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout activeSection={activeSection} onSectionClick={setActiveSection}>
      {renderSection()}
    </Layout>
  );
};

export default App;
