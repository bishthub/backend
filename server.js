const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const jackpotRoutes = require('./routes/jackpotRoutes');
const walletRoutes = require('./routes/walletRoutes');
const blogRoutes = require('./routes/blogRoutes');
const entryPassRoutes = require('./routes/entryPassRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const cartRoutes = require('./routes/cartRoutes');
const emailRoutes = require('./routes/emailRoutes');
const nftScanRoutes = require('./routes/nftscanRoutes');
const nftRoutes = require('./routes/nftRoutes');
const questionRoutes = require('./routes/questionRoutes');
const swapRoutes = require('./routes/swapRoutes');

const app = express();
app.use(express.json({ limit: '20mb' }));
require('dotenv').config();
const corsOptions = {
  origin: ['https://galxe.com', '*'], // Replace with your local development URL
  methods: '*',
};

app.use(cors(corsOptions));
mongoose.connect('mongodb+srv://bisht:bishtji@dashboard.ihnggmw.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/jackpot', jackpotRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/entryPass', entryPassRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/nftScan', nftScanRoutes);
app.use('/api/nft', nftRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/swap', swapRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
