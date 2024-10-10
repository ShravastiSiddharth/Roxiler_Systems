import React, { useState, useEffect } from 'react';

const TransactionsStatistics = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      const response = await fetch(`https://roxiler-systems-m044.onrender.com/api/statistics?month=${selectedMonth}`);
      const data = await response.json();
      setStatistics(data);
    };

    fetchStatistics();
  }, [selectedMonth]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-4 max-w-lg mx-auto border-l-4 border-sky-600">
    <h2 className="text-2xl font-bold mb-4 text-sky-600">
      Transaction Statistics for {selectedMonth === '' ? "All Products" : selectedMonth}
    </h2>
    <div className="space-y-4">
      <div className="flex justify-between p-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg shadow-md">
        <h3 className="font-semibold text-lg">Total Sale Amount:</h3>
        <p className="text-xl font-medium text-sky-700">&#8377;{statistics.totalSaleAmount.toFixed(2)}</p>
      </div>
      <div className="flex justify-between p-4 bg-gradient-to-r from-green-200 to-blue-200 rounded-lg shadow-md">
        <h3 className="font-semibold text-lg">Total Sold Items:</h3>
        <p className="text-xl font-medium text-sky-700">{statistics.totalSoldItems}</p>
      </div>
      <div className="flex justify-between p-4 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-lg shadow-md">
        <h3 className="font-semibold text-lg">Total Not Sold Items:</h3>
        <p className="text-xl font-medium text-sky-700">{statistics.totalNotSoldItems}</p>
      </div>
    </div>
  </div>
  );
};

export default TransactionsStatistics;
