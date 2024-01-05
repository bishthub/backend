const { ethers } = require('ethers');
const Question = require('../models/questionModel');
require('dotenv').config();
// Assuming you have your contract ABI and address
const contractABI = require('../services/taiko.json');
const { recordTransaction } = require('../utils/transactionUtils');

exports.addQuestion = async (req, res) => {
  try {
    let contractAddress, provider, privateKey;
    const chainName = req.body.chainName; // Assuming chainName is part of the request body

    if (chainName === 'arbitrum') {
      contractAddress = '0xf45Eba06d8b6d5987eCAEEf73EB4eCb4ec349d86';
      provider = new ethers.providers.JsonRpcProvider(
        'https://goerli-rollup.arbitrum.io/rpc'
      );
      privateKey = process.env.CHROME_PRIV_KEY;
    } else if (chainName === 'zeta') {
      contractAddress = '0x7E02a03c711DcAaBFd6d90414250a8713e81DF6a';
      provider = new ethers.providers.JsonRpcProvider(
        'https://zetachain-athens-evm.blockpi.network/v1/rpc/public'
      );
      privateKey = process.env.PRIVATE_KEY;
    } else if (chainName === 'taiko') {
      contractAddress = '0xBB7c405bAB67C0191cacCe92a93440fB5A871e2c';
      provider = new ethers.providers.JsonRpcProvider(
        'https://rpc.jolnir.taiko.xyz'
      );
      privateKey = process.env.PRIVATE_KEY;
    } else {
      return res
        .status(400)
        .send({ error: 'Invalid or unsupported chain name.' });
    }
    console.log('HERE');
    // Create a wallet and contract instance
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // Count existing questions to determine the next questionId
    const questionCount = await Question.countDocuments();
    const questionId = questionCount + 1;
    req.body.questionNumber = questionId;
    const question = new Question(req.body);
    await question.save();

    // Find the option with blockchainNumber
    const blockchainOption = question.options.find(
      (option) => option.blockchainNumber
    );

    if (!blockchainOption) {
      return res
        .status(400)
        .send({ error: 'Blockchain number not specified.' });
    }

    // Use the blockchainNumber from the option
    const blockchainNumber = blockchainOption.blockchainNumber;

    // Interact with the contract
    const tx = await contract.addQuestion(
      questionId.toString(),
      blockchainNumber.toString(),
      { gasLimit: ethers.utils.hexlify(1000000) }
    );
    await tx.wait();

    res.status(201).send(question);
  } catch (error) {
    console.error('Error in addQuestion:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!question) {
      return res.status(404).send();
    }
    res.send(question);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).send();
    }
    res.send(question);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getQuestions = async (req, res) => {
  const { chainName, answered } = req.query; // assuming query params `chainName` and `answered` are provided
  const userId = req.user._id; // assuming your token decoding sets `req.user`

  try {
    let questionsQuery = Question.find();

    // Filter by chainName if provided
    if (chainName) {
      questionsQuery = questionsQuery.where({ chainName });
    }

    const questions = await questionsQuery;
    const filteredQuestions = questions
      .map((question) => {
        const hasAnswered = question.answeredByUsers.includes(userId);
        const isAnsweredQuery = answered === 'true'; // or some other logic based on the query parameter
        return isAnsweredQuery === hasAnswered ? question : null;
      })
      .filter((q) => q !== null);

    res.send(filteredQuestions);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.answerQuestion = async (req, res) => {
  const { questionId, optionId } = req.body;
  const userId = req.user._id;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).send({ message: 'Question not found' });
    }

    const option = question.options.id(optionId);
    if (!option) {
      return res.status(404).send({ message: 'Option not found' });
    }

    if (question.answeredByUsers.includes(userId)) {
      return res
        .status(400)
        .send({ message: 'User has already answered this question' });
    }

    // Increment the selected option count and total answered
    option.count += 1;
    question.totalAnswered += 1;
    question.answeredByUsers.push(userId);

    await recordTransaction({
      moduleName: 'Questions',
      amount: 50,
      chain: 'arbitrum',
      from: '6552a17a38e77523a012d3e5',
      to: userId,
    });

    await question.save();

    res.send({ message: 'Answer recorded' });
  } catch (error) {
    res.status(400).send(error);
  }
};
