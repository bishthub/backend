const { ethers } = require('ethers');
const abi = require('../services/bitgertAbi.json');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const tokenIdFilePath = path.join(__dirname, 'tokenId.txt');

// Function to get and increment the token ID
const getNextTokenId = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(tokenIdFilePath, 'utf8', (err, data) => {
      if (err) {
        // If the file doesn't exist, start with tokenId 1
        if (err.code === 'ENOENT') {
          fs.writeFile(tokenIdFilePath, '1', (err) => {
            if (err) reject(err);
            resolve(1);
          });
        } else {
          reject(err);
        }
      } else {
        let tokenId = parseInt(data);
        tokenId++;
        fs.writeFile(tokenIdFilePath, tokenId.toString(), (err) => {
          if (err) reject(err);
          resolve(tokenId);
        });
      }
    });
  });
};

// Example of how to use getNextTokenId in a controller function
exports.issueToken = async (req, res) => {
  try {
    const tokenId = await getNextTokenId();
    // Add your logic here to issue the token using the incremented tokenId
    res.json({ tokenId });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const contractAbi = abi;
const contractAddress = '0x247314AB4d4a0518962D1e980Fc21C3f757B5631';

exports.mintNFTbyOwner = async (req, res) => {
  try {
    const userPrivateKey = process.env.PRIVATE_KEY;
    // Assume the private key is sent in the request body
    const toAddress = req.body.accountId; // Assume the account id is sent in the request body

    // Initialize a wallet instance with the user's private key
    const wallet = new ethers.Wallet(userPrivateKey);

    // Assume you have the RPC URL for the Omni network
    const provider = new ethers.providers.JsonRpcProvider(
      'https://bsc-dataseed1.binance.org/'
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
    const mintTx = await contract.mintNFTForOwner(toAddress);

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
