const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./utils/dbConnection');
const productRoutes = require('./routes/productRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
const mongoURI = process.env.DB_URL;
connectDB(mongoURI);

// Get Request data in JSON
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// root route
app.get('/', (req, res, next) => {
    res.send('Hello from server');
})

// set route proxy
app.use('/api/v1/', productRoutes);
app.use('/api/v1/', invoiceRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});