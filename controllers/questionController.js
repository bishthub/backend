const { ethers } = require('ethers');
const Question = require('../models/questionModel');
require('dotenv').config();
// Assuming you have your contract ABI and address
const contractABI = require('../services/taiko.json');
const contractAddress = '0x7e3B78015f26405d5f2460c9A35F77d64CFA5A32';

// Provider and Signer setup (Using a private key - Be careful with private key management)
const provider = new ethers.providers.JsonRpcProvider(
  'https://rpc.jolnir.taiko.xyz'
);
const privateKey = process.env.PRIVATE_KEY; // Store this securely and never expose it
const wallet = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

exports.addQuestion = async (req, res) => {
  try {
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

    await question.save();

    res.send({ message: 'Answer recorded' });
  } catch (error) {
    res.status(400).send(error);
  }
};
