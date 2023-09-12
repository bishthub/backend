const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const jackpotRoutes = require('./routes/jackpotRoutes');
const walletRoutes = require('./routes/walletRoutes');

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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
