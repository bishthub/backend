const Wallet = require('../models/walletModel');

exports.getWalletDetails = async (req, res) => {
  const wallet = await Wallet.findOne({ userId: req.user._id });

  if (!wallet) {
    return res.status(404).send('Wallet not found');
  }

  res.send(wallet);
};

// Add a new chain to the wallet's chains array
exports.addChain = async (req, res) => {
  try {
    const { chainName, walletAddress, tokens, isPrimary } = req.body;
    const userId = req.user._id; // Assuming you have the user's ID in the request

    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).send('Wallet not found');
    }

    const newChain = {
      chainName,
      walletAddress,
      tokens,
      isPrimary: false, // By default, the new chain is not primary
    };

    if (isPrimary) {
      // Ensure only one primary chain exists
      wallet.chains.forEach((chain) => {
        chain.isPrimary = false;
      });
      newChain.isPrimary = true;
    }

    wallet.chains.push(newChain);
    wallet.totalTokens += tokens;

    await wallet.save();

    res.status(201).json({ message: 'Chain added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an existing chain in the wallet's chains array
exports.updateChain = async (req, res) => {
  try {
    const { chainName, walletAddress, tokens, isPrimary } = req.body;
    const userId = req.user._id; // Assuming you have the user's ID in the request

    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).send('Wallet not found');
    }

    const existingChain = wallet.chains.find(
      (chain) => chain.chainName === chainName
    );

    if (!existingChain) {
      return res.status(404).send('Chain not found');
    }

    if (isPrimary) {
      // Ensure only one primary chain exists
      wallet.chains.forEach((chain) => {
        chain.isPrimary = false;
      });
      existingChain.isPrimary = true;
    }

    // Update the chainName and walletAddress
    existingChain.chainName = chainName;
    existingChain.walletAddress = walletAddress;

    // Check if tokens and isPrimary are provided before updating them
    if (tokens !== undefined) {
      existingChain.tokens = tokens;
    }

    if (isPrimary !== undefined) {
      existingChain.isPrimary = isPrimary;
    }

    wallet.totalTokens = wallet.chains.reduce(
      (sum, chain) => sum + (chain.tokens || 0),
      0
    );

    await wallet.save();

    res.status(200).json({ message: 'Chain updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a chain from the wallet's chains array
exports.deleteChain = async (req, res) => {
  try {
    const { chainId } = req.params;
    const userId = req.user._id; // Assuming you have the user's ID in the request

    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).send('Wallet not found');
    }

    const existingChainIndex = wallet.chains.findIndex(
      (chain) => chain._id == chainId
    );

    if (existingChainIndex === -1) {
      return res.status(404).send('Chain not found');
    }

    const deletedChain = wallet.chains.splice(existingChainIndex, 1)[0];

    if (deletedChain.isPrimary && wallet.chains.length > 0) {
      wallet.chains[0].isPrimary = true; // Set the first chain as primary
    }

    wallet.totalTokens = wallet.chains.reduce(
      (sum, chain) => sum + chain.tokens,
      0
    );

    await wallet.save();

    res.status(200).json({ message: 'Chain deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
