const { ethers } = require("ethers");
const abi = require("../services/abi.json");

const contractAbi = abi;
const contractAddress = "0xC51f9033ae9C1A342a3cd9722a085fB6B4936D63";

exports.mintNFTbyOwner = async (req, res) => {
  try {
    const userPrivateKey =
      "5a4dc7dff0e11aa0cd7f216fcc8cde2784df49911e76b8d978e6b6100fe093e3";
    // Assume the private key is sent in the request body
    const toAddress = req.body.accountId; // Assume the account id is sent in the request body
    // 0b3ff02a9fe92aaedf7eedd5b9cee927adfaa41e560d9cc5df248eb3833fe35d
    // Initialize a wallet instance with the user's private key
    const wallet = new ethers.Wallet(userPrivateKey);

    // Assume you have the RPC URL for the Omni network
    const provider = new ethers.providers.JsonRpcProvider(
      "https://testnet.omni.network"
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
      "🚀 ~ file: nftController.js:30 ~ exports.mintNFTbyOwner= ~ co̥ntract:",
      contract
    );

    // Call mintNFTbyOwner on the contract
    const mintTx = await contract.mintNFTByOwner(toAddress);

    // Wait for the transaction to be mined
    const receipt = await mintTx.wait();

    res.status(200).json({
      message: "NFT minted successfully",
      transactionReceipt: receipt,
    });
  } catch (error) {
    console.error("Error minting NFT:", error);
    res.status(500).json({ error: "Error minting NFT" });
  }
};
