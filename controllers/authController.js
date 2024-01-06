const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Wallet = require('../models/walletModel');
const { ethers } = require('ethers');
const zetaAbi = require('../services/zetaAbi.json');

const generateUniqueReferralCode = async () => {
  while (true) {
    const code = generateRandomReferralCode();
    const existingUser = await User.findOne({ referralCode: code });
    if (!existingUser) {
      return code;
    }
  }
};

const generateRandomReferralCode = () => {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
};

exports.register = async (req, res) => {
  try {
    // Check if username is taken
    const { ethereumAddress } = req.body;
    console.log(req.body);
    if (!ethereumAddress) {
      return res.status(400).send('Ethereum address is required');
    }
    // Check if a user with this Ethereum address already exists
    const existingUser = await User.findOne({ loginAddress: ethereumAddress });
    if (existingUser) {
      return res
        .status(400)
        .send('This Ethereum address is already registered');
    }
    const userWithSameUsername = await User.findOne({
      username: req.body.username,
    });
    if (userWithSameUsername) {
      return res.status(400).send('Username is already registered');
    }

    // If all checks pass, proceed to register the new user
    // const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log('HERE I AM', ethereumAddress);
    const user = new User({
      username: req.body.username,
      loginAddress: ethereumAddress,
    });

    // Generate a unique 7-character referral code
    user.referralCode = await generateUniqueReferralCode();

    // Check for referral
    if (req.body.referralCode) {
      const referringUser = await User.findOne({
        referralCode: req.body.referralCode,
      });
      if (!referringUser) {
        return res.status(400).send('Invalid referral code');
      }
      user.referredBy = referringUser._id; // assuming your User model has a referredBy field
      user.isReferred = true;
      referringUser.referredUsers.push(user._id);
      referringUser.totalReferred += 1;
      await referringUser.save();
    }

    const wallet = new Wallet({
      userId: user._id,
      chains: [
        {
          chainName: 'Arbitrum Goerli',
          walletAddress: ethereumAddress,
          chainId: '6546327867cf2a127d7a329a',
        },
        {
          chainName: 'Blazpay',
          walletAddress: ethereumAddress,
          chainId: '654631f567cf2a127d7a328c',
        },
        {
          chainName: 'Omni Testnet',
          walletAddress: ethereumAddress,
          chainId: '6546326367cf2a127d7a3297',
        },
        {
          chainName: 'Matic',
          walletAddress: ethereumAddress,
          chainId: '654631e267cf2a127d7a3289',
        },
        {
          chainName: 'Shardeum',
          walletAddress: ethereumAddress,
          chainId: '6557a06fe9b49dc72809ae44',
        },
        {
          chainName: 'Router',
          walletAddress: ethereumAddress,
          chainId: '6557a089e9b49dc72809ae45',
        },
        {
          chainName: 'Zeta',
          walletAddress: ethereumAddress,
          chainId: '655ed40dacc2b382311db172',
        },
        {
          chainName: 'Taiko',
          walletAddress: ethereumAddress,
          chainId: '655ed41eacc2b382311db174',
        },
        {
          chainName: 'Binance',
          walletAddress: ethereumAddress,
          chainId: '6599594ea8b3abeaf96d6ee8',
        },
      ],
    });

    await wallet.save();
    console.log('IT IS HERE');
    // Link user to the wallet
    user.walletId = wallet._id;
    await user.save();
    res.status(201).send('User registered');
  } catch (error) {
    console.log('ERROR', error);
    res.status(500).send('Internal Server Error');
  }
};

const getNFTBalance = async (address) => {
  const providers = {
    bsc: new ethers.providers.JsonRpcProvider(
      'https://bsc-dataseed1.binance.org/'
    ),
    zeta: new ethers.providers.JsonRpcProvider(
      'https://zetachain-athens-evm.blockpi.network/v1/rpc/public'
    ),
  };

  const contractAddresses = {
    bsc: '0x247314AB4d4a0518962D1e980Fc21C3f757B5631',
    zeta: '0x4dE7CD522f1715b2a48F3ad6612924841d450A0F',
  };

  const contractABI = zetaAbi; // Assuming the ABI is the same for both contracts

  const bscContract = new ethers.Contract(
    contractAddresses.bsc,
    contractABI,
    providers.bsc
  );
  const zetaContract = new ethers.Contract(
    contractAddresses.zeta,
    contractABI,
    providers.zeta
  );

  const [bscBalance, zetaBalance] = await Promise.all([
    bscContract.balanceOf(address),
    zetaContract.balanceOf(address),
  ]);

  return bscBalance.add(zetaBalance);
};

exports.login = async (req, res) => {
  const { ethereumAddress } = req.body;

  try {
    const totalNFTBalance = await getNFTBalance(ethereumAddress);

    if (totalNFTBalance.isZero()) {
      return res
        .status(400)
        .send('You do not have Zeta or Bitgert entry pass.');
    }

    const user = await User.findOne({ loginAddress: ethereumAddress });
    if (!user) {
      return res.status(400).send('User not found');
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, 'YOUR_SECRET', {
      expiresIn: '60m',
    });

    const userdata = {
      _id: user._id,
      username: user.username,
      role: user.role,
    };

    res.json({ token, user: userdata });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.dashboard = (req, res) => {
  res.send('Dashboard Content');
};
