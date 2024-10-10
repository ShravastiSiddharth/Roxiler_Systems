const Product = require('../models/Product');
const axios = require('axios');


const getMonthNumber = (month) => {
    const months = {
        January: 0, February: 1, March: 2, April: 3, May: 4, June: 5, July: 6,
        August: 7, September: 8, October: 9, November: 10, December: 11
    };
    return months[month];
};


const listTransactions = async (req, res) => {
    const { search = '', page = 1, perPage = 10, month, price } = req.query;
    const regex = new RegExp(search, 'i');
    const monthNumber = getMonthNumber(month);

    try {
        const query = { $and: [] };

       
        if (search) {
            query.$and.push({
                $or: [
                    { title: regex },
                    { description: regex }
                ]
            });
        }

      
        if (month) {
            query.$and.push({ $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber + 1] } });
        }

      
        if (price !== undefined && price !== '') {
          
            const numericPrice = parseFloat(price);
            if (!isNaN(numericPrice)) {
                query.$and.push({ price: numericPrice });
            }
        }

    
        const products = await Product.find(query.$and.length > 0 ? query : {})
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage, 10));

       
        const total = await Product.countDocuments(query.$and.length > 0 ? query : {});

     
        res.status(200).json({ total, page: parseInt(page, 10), perPage: parseInt(perPage, 10), data: products });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};


const getStatistics = async (req, res) => {
    const { month } = req.query;
    const monthNumber = month ? getMonthNumber(month) : null;

    try {
        let products;

       
        if (monthNumber !== null) {
            products = await Product.find({ 
                $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber + 1] } 
            });
        } else {
            products = await Product.find(); 
        }

        const totalSaleAmount = products.reduce((sum, product) => product.sold ? sum + product.price : sum, 0);
        const totalSoldItems = products.filter(product => product.sold).length;
        const totalNotSoldItems = products.filter(product => !product.sold).length;

        res.status(200).json({ totalSaleAmount, totalSoldItems, totalNotSoldItems });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};



const getPriceRange = async (req, res) => {
    const { month } = req.query;
    const monthNumber = month ? getMonthNumber(month) : null; 

    const ranges = [
        { label: '0-100', min: 0, max: 100 },
        { label: '101-200', min: 101, max: 200 },
        { label: '201-300', min: 201, max: 300 },
        { label: '301-400', min: 301, max: 400 },
        { label: '401-500', min: 401, max: 500 },
        { label: '501-600', min: 501, max: 600 },
        { label: '601-700', min: 601, max: 700 },
        { label: '701-800', min: 701, max: 800 },
        { label: '801-900', min: 801, max: 900 },
        { label: '901-above', min: 901, max: Infinity }
    ];

    try {
        
        const products = monthNumber !== null 
            ? await Product.find({ $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber + 1] } })
            : await Product.find(); 

        const priceRangeData = ranges.map(range => ({
            range: range.label,
            count: products.filter(product => product.price >= range.min && product.price <= range.max).length
        }));

        res.status(200).json(priceRangeData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch price range data' });
    }
};


const getCategory = async (req, res) => {
    const { month } = req.query;
    const monthNumber = getMonthNumber(month);

    try {
        const products = await Product.find({ $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber + 1] } });

        const categoryData = products.reduce((acc, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
        }, {});

        res.status(200).json(categoryData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch category data' });
    }
};




const getCombinedData = async (req, res) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ error: 'Month parameter is required' });
    }

    try {
       
        const statisticsResponse = await axios.get(`http://localhost:5000/api/statistics?month=${month}`);
        const statistics = statisticsResponse.data;

        
        const priceRangeDataResponse = await axios.get(`http://localhost:5000/api/bar-chart?month=${month}`);
        const priceRangeData = priceRangeDataResponse.data;

       
        const categoryDataResponse = await axios.get(`http://localhost:5000/api/pie-chart?month=${month}`);
        const categoryData = categoryDataResponse.data;

      
        const combinedResponse = {
            statistics,
            priceRangeData,
            categoryData,
        };

        res.status(200).json(combinedResponse);
    } catch (error) {
        console.error('Error fetching combined data:', error);
        res.status(500).json({ error: 'Failed to fetch combined data' });
    }
};



module.exports = { getCombinedData, getCategory, getPriceRange, getStatistics, listTransactions }