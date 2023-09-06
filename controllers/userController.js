const User = require("../models/userModel");

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
      return res.status(404).send("User not found");
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from the route parameter
    const user = await User.findById(userId).select("-password"); // Exclude password from the response

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
