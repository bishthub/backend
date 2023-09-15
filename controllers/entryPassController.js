// entryPassController.js
const EntryPass = require('../models/entryPassModel');

exports.addEntryPass = async (req, res) => {
  try {
    const entryPass = new EntryPass(req.body);
    await entryPass.save();
    res.status(201).send(entryPass);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.getAllEntryPasses = async (req, res) => {
  try {
    const entryPasses = await EntryPass.find();
    res.status(200).send(entryPasses);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.updateEntryPass = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const entryPass = await EntryPass.findById(req.params.id);

    if (!entryPass) {
      return res.status(404).send('Entry Pass not found');
    }

    updates.forEach((update) => (entryPass[update] = req.body[update]));
    await entryPass.save();

    res.status(200).send(entryPass);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteEntryPass = async (req, res) => {
  try {
    const entryPass = await EntryPass.findByIdAndDelete(req.params.id);

    if (!entryPass) {
      return res.status(404).send('Entry Pass not found');
    }

    res.status(200).send({ message: 'Entry Pass deleted successfully' });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};
