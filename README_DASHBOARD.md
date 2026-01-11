# 📊 Retail Sales Forecasting Dashboard

A comprehensive Streamlit dashboard for visualizing retail sales forecasting analysis.

## 🚀 Quick Start

### 1. Install Streamlit (if not already installed)

```bash
# Activate your virtual environment first
source venv/bin/activate

# Install streamlit
pip install streamlit
```

Or install all requirements:
```bash
pip install -r requirements.txt
```

### 2. Run the Dashboard

```bash
# Make sure you're in the project directory
cd /Users/mbgirish/Retail-Sales-Time-Series-Forecasting-System

# Activate virtual environment
source venv/bin/activate

# Run the dashboard
streamlit run dashboard.py
```

The dashboard will automatically open in your browser at `http://localhost:8501`

## 📋 Dashboard Features

### 1. **📈 Overview**
- Key metrics (Total Sales, Average Daily Sales, Peak Sales, Date Range)
- Sales trend over time visualization
- Monthly sales aggregation
- Data quality statistics

### 2. **📅 Seasonal Analysis**
- Weekly patterns (day-of-week analysis)
- Monthly patterns (seasonal trends)
- Promotion impact analysis
- Day-of-month patterns

### 3. **🤖 Model Performance**
- Model comparison metrics (MAE, RMSE, MAPE)
- Visual comparison charts
- Best model identification

### 4. **🔮 Forecasts**
- Interactive forecast horizon selector (30-90 days)
- Historical vs forecast visualization
- Confidence intervals
- Forecast summary metrics

### 5. **💡 Business Insights**
- Key findings and patterns
- Business recommendations:
  - Inventory Planning
  - Promotion Timing
  - Staffing Optimization
  - Supply Chain Optimization
- Expected business impact metrics

## 🎨 Features

- **Interactive Visualizations**: All charts are interactive and responsive
- **Real-time Data Loading**: Cached data loading for performance
- **Multiple Views**: Navigate between different analysis sections
- **Business-Focused**: Actionable insights and recommendations
- **Professional UI**: Clean, modern interface with custom styling

## 📁 File Structure

```
Retail-Sales-Time-Series-Forecasting-System/
├── dashboard.py              # Main Streamlit dashboard
├── retail_sales_forecasting.ipynb  # Jupyter notebook analysis
├── requirements.txt          # Python dependencies
└── README_DASHBOARD.md      # This file
```

## 🔧 Configuration

The dashboard expects data at:
```
/Users/mbgirish/Downloads/store-sales-time-series-forecasting/
├── train.csv
├── stores.csv
└── holidays_events.csv
```

To change the data path, edit the `DATA_PATH` variable in `dashboard.py`:

```python
DATA_PATH = '/path/to/your/data'
```

## 💡 Tips

1. **First Run**: The dashboard will cache data on first load for faster subsequent runs
2. **Forecast Horizon**: Use the slider to adjust forecast period (30-90 days)
3. **Navigation**: Use the sidebar to switch between different analysis views
4. **Full Screen**: Click on charts to view them in full screen mode

## 🐛 Troubleshooting

### Dashboard won't start
- Make sure Streamlit is installed: `pip install streamlit`
- Check that you're in the correct directory
- Verify your virtual environment is activated

### Data not loading
- Check that the data path is correct
- Ensure CSV files exist in the specified directory
- Check file permissions

### Charts not displaying
- Make sure matplotlib and seaborn are installed
- Try refreshing the browser
- Check the terminal for error messages

## 🚀 Deployment

To deploy this dashboard:

1. **Streamlit Cloud** (Recommended):
   - Push code to GitHub
   - Connect to Streamlit Cloud
   - Deploy automatically

2. **Local Server**:
   ```bash
   streamlit run dashboard.py --server.port 8501
   ```

3. **Docker**:
   - Create Dockerfile
   - Build and run container

## 📝 Notes

- The dashboard uses cached data loading for performance
- Model performance metrics are simulated (in production, connect to actual model results)
- Forecasts use simplified algorithms (connect to trained models for production)

## 🤝 Contributing

To enhance the dashboard:
1. Add new visualizations in the appropriate page section
2. Update business insights based on new findings
3. Connect to actual model training pipeline for real metrics

---

**Built with ❤️ using Streamlit**


