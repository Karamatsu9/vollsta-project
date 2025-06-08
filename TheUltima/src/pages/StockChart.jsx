import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import "../css/StockChart.css"

// Register all necessary components
Chart.register(...registerables);

const StockChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        const products = response.data;

        // Process data for chart
        const labels = products.map(item => `Product ${item.Name}`); // Use product ID or name for labels
        const stockData = products.map(item => item.Stock); // Extract stock values

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Stock Quantity',
              data: stockData,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Stock Chart</h2>
      {chartData.labels.length > 0 ? (
        <Bar data={chartData} options={{ responsive: true }} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default StockChart;
