# Setup Guide

## Virtual Environment Created ✅

A Python virtual environment has been created in the `venv/` folder with all required packages installed.

## Using the Virtual Environment

### In VS Code/Cursor:

1. **Select the Python Interpreter:**
   - Press `Cmd+Shift+P` (or `Ctrl+Shift+P`)
   - Type "Python: Select Interpreter"
   - Choose: `./venv/bin/python` (or the venv option)

2. **For Jupyter Notebooks:**
   - When prompted to "Select Kernel", choose:
     - "Python Environments..." → Select `./venv/bin/python`
   - Or use the kernel selector in the top-right of the notebook

### In Terminal:

```bash
# Activate the virtual environment
source venv/bin/activate

# Your prompt will show (venv) when active
# Now you can run Python scripts or Jupyter

# To deactivate when done
deactivate
```

## Running the Notebook

1. Open `retail_sales_forecasting.ipynb`
2. Select the kernel: `./venv/bin/python`
3. Run cells sequentially from top to bottom
4. Ensure your data is at: `/Users/mbgirish/Downloads/store-sales-time-series-forecasting/`

## Installed Packages

- pandas, numpy
- matplotlib, seaborn
- statsmodels
- prophet
- scikit-learn
- jupyter, ipykernel

All packages are ready to use! 🚀

