import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LinearScale, CategoryScale, BarElement, Title, Tooltip, Legend);

const TransactionsBarChart = ({ selectedMonth }) => {
  const [chartData, setChartData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchBarChartData = async () => {
      const response = await fetch(`https://roxiler-systems-m044.onrender.com/api/bar-chart?month=${selectedMonth}`);
      const data = await response.json();
      setChartData(data);
    };

    fetchBarChartData();
  }, [selectedMonth]);

  const data = {
    labels: chartData.map(item => item.range),
    datasets: [
      {
        label: 'Number of Items',
        data: chartData.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Items',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Price Range',
        },
      },
    },
  };

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <>
      {chartData.length === 0 ? (
        ""
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-2 text-sky-600">
            Transactions Bar Chart for {selectedMonth === '' ? "All Products" : selectedMonth}
          </h2>
          <div style={{ height: '300px', position: 'relative' }}>
            <Bar ref={chartRef} data={data} options={options} />
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionsBarChart;
