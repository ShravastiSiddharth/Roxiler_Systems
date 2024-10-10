import React, { useState, useEffect } from 'react';
import TransactionsStatistics from './TransactionsStatistics';
import TransactionsBarChart from './TransactionsBarchart';
import Header from './Header';

const months = [

  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [price, setPrice] = useState('');
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const fetchTransactions = async (searchText = '', month = selectedMonth, PriceValue = '') => {
    console.log('Fetching with:', { searchText, month, page, perPage, PriceValue });
    const response = await fetch(
      `https://roxiler-systems-m044.onrender.com/api/transactions?search=${searchText}&month=${month}&page=${page}&perPage=${perPage}&price=${PriceValue}`
    );
    const data = await response.json();
    setTransactions(data.data);
    setTotal(data.total);
  };

  useEffect(() => {
    fetchTransactions(search, selectedMonth, price);
  }, [search, selectedMonth, page, price]);



  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setPage(1);
  };

  const handleNextPage = () => {
    if (page * perPage < total) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const resetQuery = () => {
    setPrice('')
    setSearch('')
    setSelectedMonth('')
  }


  return (
    <>

    <Header/>
      <div className="container mx-auto p-4">

      <h1 className="text-3xl font-bold text-purple-600 my-6 text-center">Transactions Overview</h1>

       


        <div className="flex mb-4 items-center">
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="border rounded-lg p-2 mr-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="" disabled>Select Month</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg p-2 mr-4 w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="Search Price"
            value={price}
            onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
            className="border rounded-lg p-2 mr-4 w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition duration-200 transform hover:scale-105" onClick={resetQuery}>
            Reset
          </button>

        </div>


        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
          <div className="flex-1">
            <TransactionsBarChart selectedMonth={selectedMonth} />
          </div>
          <div className="flex-2">

            <TransactionsStatistics selectedMonth={selectedMonth} />
          </div>
        </div>

        {transactions.length === 0 ? (
          <p className="text-center text-gray-500">No Data</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg shadow-lg">
              <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <tr>
                  <th className="border border-gray-300 p-4 text-left text-sm font-semibold">Title</th>
                  <th className="border border-gray-300 p-4 text-left text-sm font-semibold">Description</th>
                  <th className="border border-gray-300 p-4 text-left text-sm font-semibold">Price</th>
                  <th className="border border-gray-300 p-4 text-left text-sm font-semibold">Date of Sale</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="border-b hover:bg-gray-50 transition duration-150">
                    <td className="border border-gray-300 p-3 text-sm">{transaction.title}</td>
                    <td className="border border-gray-300 p-3 text-sm">{transaction.description}</td>
                    <td className="border border-gray-300 p-3 text-sm">&#8377;{transaction.price}</td>
                    <td className="border border-gray-300 p-3 text-sm">{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}


        <div className="flex justify-between mt-4">
          <button onClick={handlePreviousPage} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition duration-200 transform hover:scale-105 " disabled={page === 1}>
            Previous
          </button>
          <button onClick={handleNextPage} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition duration-200 transform hover:scale-10 " disabled={page * perPage >= total}>
            Next
          </button>
        </div>



      </div>
    </>
  );
};

export default TransactionsTable;
