// transactionUtils.js

const Transaction = require('../models/transactionModel'); // Adjust the path as necessary

async function recordTransaction({
  moduleName,
  amount,
  chain,
  from = null,
  to,
}) {
  const newTransaction = new Transaction({
    moduleName,
    amount,
    chain,
    from,
    to,
  });
  await newTransaction.save();
}

module.exports = { recordTransaction };
