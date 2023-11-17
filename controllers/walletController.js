const Wallet = require('../models/walletModel');
const User = require('../models/userModel');
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
        case 'arbitrum goerli':
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
      if (chainName.toLowerCase() === 'arbitrum goerli') {
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

exports.getWalletByUsername = async (req, res) => {
  const username = req.query.username; // Retrieve the id from the query parameters

  // Find the wallet by the provided id
  const user = await User.findOne({ username: username });

  if (!user) {
    return res.status(404).send('Username not found');
  }

  const wallet = await Wallet.findOne({ _id: user.walletId });

  res.send(wallet);
};

// Add a new chain to the wallet's chains array
exports.addChain = async (req, res) => {
  try {
    const { chainId, walletAddress, isPrimary } = req.body;
    const userId = req.user._id; // Assuming you have the user's ID in the request

    // Check if the provided chainId matches an _id in the default chains
    const defaultChain = await Chain.findById(chainId);
    console.log(
      '🚀 ~ file: walletController.js:141 ~ exports.addChain= ~ default̥Chain:',
      defaultChain
    );
    if (!defaultChain) {
      return res.status(404).send('Chain ID does not match any default chains');
    }

    // Find the user's wallet
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).send('Wallet not found');
    }

    // Check if the chain already exists in the user's wallet
    const chainExists = wallet.chains.some((chain) => chain.chainId == chainId);
    if (chainExists) {
      return res.status(400).send('This chain is already added to the wallet');
    }

    // If isPrimary is true, unset the primary status of other chains
    if (isPrimary) {
      wallet.chains.forEach((chain) => {
        chain.isPrimary = false;
      });
    }

    // Add the new chain to the wallet
    const newChain = {
      chainId,
      chainName: defaultChain.chainName,
      walletAddress,
      isPrimary: !!isPrimary, // Coerce isPrimary to boolean
    };
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
    const { chainName, chainId, walletAddress, isPrimary } = req.body;
    const userId = req.user._id; // Assuming you have the user's ID in the request

    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).send('Wallet not found');
    }

    const existingChain = wallet.chains.find(
      (chain) => chain.chainId == chainId
    );

    if (!existingChain) {
      return res.status(404).send('Chain not found');
    }

    if (isPrimary) {
      // Ensure only one primary chain exists
      wallet.chains.forEach((chain) => {
        chain.isPrimary = false;
      });
    }
    existingChain.walletAddress = walletAddress;
    existingChain.isPrimary = isPrimary;

    await wallet.save();

    res.status(200).json({ wallet });
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
