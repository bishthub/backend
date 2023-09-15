const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const jackpotRoutes = require('./routes/jackpotRoutes');
const walletRoutes = require('./routes/walletRoutes');
const blogRoutes = require('./routes/blogRoutes');
const entryPassRoutes = require('./routes/entryPassRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
app.use(express.json());

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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
