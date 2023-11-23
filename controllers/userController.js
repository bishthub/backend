const User = require('../models/userModel');
const Wallet = require('../models/walletModel');
const Notification = require('../models/notificationModel');
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you've set the user ID in the auth middleware

    // Fields to update
    const updateFields = {};
    if (req.body.img_url) updateFields.img_url = req.body.img_url;
    if (req.body.fullName) updateFields.fullName = req.body.fullName;
    if (req.body.bio) updateFields.bio = req.body.bio;
    if (req.body.insta) updateFields.insta = req.body.insta;
    if (req.body.twitter) updateFields.twitter = req.body.twitter;
    if (req.body.linkedin) updateFields.linkedin = req.body.linkedin;
    if (req.body.discord) updateFields.discord = req.body.discord;
    if (req.body.telegram) updateFields.telegram = req.body.telegram;

    const user = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from the route parameter
    const user = await User.findById(userId).select('-password'); // Exclude password from the response

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Wallet.aggregate([
      {
        $lookup: {
          from: 'users', // Assuming your users collection is named 'users'
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $sort: { totalTokens: -1 }, // Sort by tokens in descending order
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          username: '$user.username', // Get the username from the user document
          img: '$user.img_url', // Get the user's image from the user document (update this field as per your UserModel)
          totalTokens: 1, // Include the tokens field
        },
      },
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you've set the user ID in the auth middleware

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Find notifications by IDs
    const notifications = await Notification.find({
      _id: { $in: user.notifications },
    });

    // Sort the notifications by createdAt in descending order
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Extract the text and timestamps from notifications
    const formattedNotifications = notifications.map((notification) => ({
      text: notification.text,
      createdAt: notification.createdAt,
      type: notification.type,
    }));

    res.status(200).json(formattedNotifications);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

const getReferredUsers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    const referredUsers = await User.find({ referredBy: userId });
    return res.status(200).json({
      data: {
        referralCode: user.referralCode,
        referredUsers: referredUsers,
      },
    });
  } catch (err) {
    return res.status(400).json({ error_msg: err.message });
  }
};
exports.getUsername = async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });
    if (user) {
      res.json({ available: false });
    } else {
      res.json({ available: true });
    }
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).send('Internal Server Error');
  }
};
