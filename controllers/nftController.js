const { ethers } = require('ethers');
const abi = require('../services/omniAbi.json');
require('dotenv').config();

const contractAbi = abi;
const contractAddress = '0xC51f9033ae9C1A342a3cd9722a085fB6B4936D63';

exports.mintNFTbyOwner = async (req, res) => {
  try {
    const userPrivateKey = process.env.PRIVATE_KEY;
    // Assume the private key is sent in the request body
    const toAddress = req.body.accountId; // Assume the account id is sent in the request body

    // Initialize a wallet instance with the user's private key
    const wallet = new ethers.Wallet(userPrivateKey);

    // Assume you have the RPC URL for the Omni network
    const provider = new ethers.providers.JsonRpcProvider(
      'https://testnet.omni.network'
    );

    // Connect the wallet to the Omni network
    const connectedWallet = wallet.connect(provider);

    // Create a contract instance
    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      connectedWallet
    );
    console.log(
      '🚀 ~ file: nftController.js:30 ~ exports.mintNFTbyOwner= ~ co̥ntract:',
      contract
    );

    // Call mintNFTbyOwner on the contract
    const mintTx = await contract.mintNFTByOwner(toAddress);

    // Wait for the transaction to be mined
    const receipt = await mintTx.wait();

    res.status(200).json({
      message: 'NFT minted successfully',
      transactionReceipt: receipt,
    });
  } catch (error) {
    console.error('Error minting NFT:', error);
    res.status(500).json({ error: 'Error minting NFT' });
  }
};
