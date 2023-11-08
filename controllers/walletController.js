const Wallet = require('../models/walletModel');
const Chain = require('../models/chainModel');
const omniAbi = require('../services/omniAbi.json');
const arbAbi = require('../services/arbAbi.json');
const { ethers } = require('ethers');

exports.getWalletandNFTDetails = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).send('Wallet not found');
    }

    let nftDetails = [];

    for (const chain of wallet.chains) {
      const { chainName, walletAddress } = chain;

      let provider, contractAddress, contractABI, balance;

      switch (chainName.toLowerCase()) {
        case 'omni':
          provider = new ethers.providers.JsonRpcProvider(
            'https://testnet.omni.network'
          );
          contractAddress = '0x2E84547878CeD3B28C6060ec5b7afA0ec49892CC';
          contractABI = omniAbi;
          break;
        case 'arbitrum':
          provider = new ethers.providers.JsonRpcProvider(
            'https://goerli-rollup.arbitrum.io/rpc'
          );
          contractAddress = '0x2e84547878ced3b28c6060ec5b7afa0ec49892cc';
          contractABI = arbAbi;
          break;
        default:
          console.log(`Unsupported chain: ${chainName}`);
          continue;
      }

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      // Differentiate the method call based on the chain
      if (chainName.toLowerCase() === 'arbitrum') {
        balance = await contract.countByUser(walletAddress);
      } else if (chainName.toLowerCase() === 'omni') {
        balance = await contract.balanceOf(walletAddress);
      } else {
        // Skip unsupported chains
        continue;
      }

      nftDetails.push({ chainName, balance: balance.toString() });
    }

    res.json(nftDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addDefaultChains = async (req, res) => {
  try {
    const { chainName } = req.body;

    const chain = new Chain({ chainName });
    await chain.save();

    res
      .status(201)
      .json({ message: 'Default chain added successfully', chain });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getDefaultChains = async (req, res) => {
  try {
    const chains = await Chain.find({});
    res.status(200).json(chains);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteDefaultChains = async (req, res) => {
  try {
    const { chainId } = req.params;

    await Chain.findByIdAndDelete(chainId);
    res.status(200).json({ message: 'Default chain deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateDefaultChains = async (req, res) => {
  try {
    const { chainId, chainName } = req.body;

    const chain = await Chain.findByIdAndUpdate(
      chainId,
      { chainName },
      { new: true }
    );
    res
      .status(200)
      .json({ message: 'Default chain updated successfully', chain });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

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

    await wallet.save();

    res.status(201).json({ newChain });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an existing chain in the wallet's chains array
exports.updateChain = async (req, res) => {
  try {
    const { chainId, chainName, walletAddress, tokens, isPrimary } = req.body;
    const userId = req.user._id; // Assuming you have the user's ID in the request

    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).send('Wallet not found');
    }

    const existingChain = wallet.chains.find((chain) => chain._id == chainId);

    if (!existingChain) {
      return res.status(404).send('Chain not found');
    }

    if (isPrimary) {
      // Ensure only one primary chain exists
      wallet.chains.forEach((chain) => {
        chain.isPrimary = false;
      });
    }

    existingChain.chainName = chainName;
    existingChain.walletAddress = walletAddress;
    existingChain.tokens = tokens;
    existingChain.isPrimary = isPrimary;

    wallet.totalTokens = wallet.chains.reduce(
      (sum, chain) => sum + chain.tokens,
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
